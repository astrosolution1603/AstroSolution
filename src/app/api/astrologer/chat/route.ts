import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { containsProfanity } from "@/lib/profanity-filter";

// Phone number detection regex - blocks 10+ digit sequences
const PHONE_REGEX = /(\+?[\d\s\-().]{10,}|\b\d{10}\b)/g;

function containsPhoneNumber(text: string): boolean {
  const digits = text.replace(/\D/g, "");
  return digits.length >= 10 && PHONE_REGEX.test(text);
}

// POST: Astrologer sends a message to a user's session
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const astrologerUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!astrologerUser || (astrologerUser.role !== "ASTROLOGER" && astrologerUser.role !== "ADMIN")) {
    return new Response("Forbidden", { status: 403 });
  }

  const { sessionId, content } = await req.json();
  if (!sessionId || !content?.trim()) {
    return new Response("sessionId and content required", { status: 400 });
  }

  // Block phone numbers in messages
  if (containsPhoneNumber(content)) {
    return Response.json({
      error: "Phone numbers are not allowed in chat messages. Please use the platform for communication.",
    }, { status: 422 });
  }

  // Abuse Filter: Profanity check
  if (containsProfanity(content)) {
    return Response.json({
      error: "Your message contains inappropriate language. Please maintain a professional tone.",
    }, { status: 422 });
  }

  const chatSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
  if (!chatSession) return new Response("Session not found", { status: 404 });

  // Concurrency Lock: Prevent another astrologer from taking over if already claimed
  if (chatSession.astrologerUserId && chatSession.astrologerUserId !== session.user.id) {
    return Response.json({ 
      error: "Another astrologer is already handling this chat." 
    }, { status: 409 });
  }

  const message = await prisma.chatMessage.create({
    data: {
      sessionId,
      role: "assistant",
      content: content.trim(),
      senderRole: "ASTROLOGER",
    },
  });

  // Update session - mark last human reply time & assign astrologer
  await prisma.chatSession.update({
    where: { id: sessionId },
    data: {
      updatedAt: new Date(),
      lastHumanReplyAt: new Date(),
      astrologerUserId: session.user.id,
    },
  });

  // Trigger In-App Notification to User
  const settings = await prisma.platformSettings.findUnique({ where: { id: "global" } });
  if (settings?.inAppNotificationsEnabled) {
    await prisma.inAppNotification.create({
      data: {
        userId: chatSession.userId,
        title: `Astrologer ${astrologerUser.name} Replied`,
        message: content.trim(),
        link: `/chat?session=${sessionId}`
      }
    });
  }

  return Response.json(message, { status: 201 });
}

// GET: Get sessions assigned to or available for this astrologer
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const astrologerUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!astrologerUser || (astrologerUser.role !== "ASTROLOGER" && astrologerUser.role !== "ADMIN")) {
    return new Response("Forbidden", { status: 403 });
  }

  // Get all human astrologer IDs to exclude their direct chats from the global pool
  const humanAstrologers = await prisma.user.findMany({
    where: { role: "ASTROLOGER" },
    select: { id: true }
  });
  const otherHumanAstroIds = humanAstrologers
    .map(a => a.id)
    .filter(id => id !== session.user.id);

  const sessions = await prisma.chatSession.findMany({
    where: {
      OR: [
        { astrologerUserId: session.user.id }, // Chats I have claimed
        { astrologerId: session.user.id },     // Chats explicitly started with me
        { 
          // Open AI chats that haven't been claimed yet AND are active recently (last 1 hour)
          astrologerUserId: null,
          astrologerId: { notIn: otherHumanAstroIds },
          updatedAt: { gt: new Date(Date.now() - 60 * 60 * 1000) }
        }
      ]
    },
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { name: true, phone: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return Response.json(sessions);
}
