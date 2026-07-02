import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Poll for new messages in a session — only the session owner or the assigned astrologer can read
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const after = searchParams.get("after");

  if (!sessionId || typeof sessionId !== "string") {
    return new Response("sessionId required", { status: 400 });
  }

  // IDOR fix: verify the caller owns this session or is the assigned astrologer
  const chatSession = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    select: { userId: true, astrologerUserId: true, lastHumanReplyAt: true },
  });

  if (!chatSession) return new Response("Not Found", { status: 404 });

  const isOwner = chatSession.userId === session.user.id;
  const isAssignedAstrologer = chatSession.astrologerUserId === session.user.id;

  // Also allow any ASTROLOGER/ADMIN to poll (for the waiting room)
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  const isAstrologer = currentUser?.role === "ASTROLOGER";
  const isAdmin = currentUser?.role === "ADMIN";
  const isUnassigned = !chatSession.astrologerUserId;

  // Allow astrologer to read if it's assigned to them, OR if it's currently unassigned (waiting room).
  // Do NOT allow Astrologer A to read Astrologer B's active chats.
  if (!isOwner && !isAssignedAstrologer && !(isAstrologer && isUnassigned) && !isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }

  const where: any = { sessionId };
  if (after) {
    const afterDate = new Date(after);
    if (!isNaN(afterDate.getTime())) {
      where.createdAt = { gt: afterDate };
    }
  }

  const messages = await prisma.chatMessage.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  return Response.json({ messages, lastHumanReplyAt: chatSession.lastHumanReplyAt });
}
