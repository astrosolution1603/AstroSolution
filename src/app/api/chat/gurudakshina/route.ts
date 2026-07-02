import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const { sessionId, amount } = await req.json();

  // Validate amount: must be positive integer, max ₹5100
  const parsedAmount = parseInt(amount, 10);
  if (!sessionId || isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 5100) {
    return new Response("Invalid request", { status: 400 });
  }

  const chatSession = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: { user: true }
  });

  if (!chatSession) return new Response("Session not found", { status: 404 });

  // IDOR fix: only the session owner can send gurudakshina
  if (chatSession.userId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!chatSession.astrologerUserId) {
    return new Response("No human astrologer assigned to this session", { status: 400 });
  }

  const astrologerId = chatSession.astrologerUserId;

  // Split amount 50/50
  const astrologerCut = Math.floor(amount / 2);
  const platformCut = amount - astrologerCut;

  try {
    // Perform transaction, update wallet, and send chat message in a single Prisma transaction
    await prisma.$transaction(async (tx) => {
      // 1. Create Transaction record
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          astrologerId: astrologerId,
          amount,
          astrologerCut,
          platformCut,
          type: "CHAT_GURUDAKSHINA",
          status: "COMPLETED",
        }
      });

      // 2. Update Astrologer's Wallet (create if doesn't exist)
      await tx.wallet.upsert({
        where: { astrologerId: astrologerId },
        update: { availableBalance: { increment: astrologerCut } },
        create: {
          astrologerId: astrologerId,
          availableBalance: astrologerCut,
        }
      });

      // 3. Send system message in chat
      await tx.chatMessage.create({
        data: {
          sessionId,
          role: "assistant",
          content: `🙏 User has paid ₹${amount} as Gurudakshina! Thank you!`,
          senderRole: "AI", // System message
        }
      });

      // 4. Update session timestamp to trigger UI polling
      await tx.chatSession.update({
        where: { id: sessionId },
        data: { updatedAt: new Date() }
      });
    });

    return Response.json({ success: true });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
