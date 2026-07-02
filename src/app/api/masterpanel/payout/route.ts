import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!admin || admin.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const { astrologerId } = await req.json();
    if (!astrologerId) {
      return new Response("Missing astrologerId", { status: 400 });
    }

    const wallet = await prisma.wallet.findUnique({ where: { astrologerId } });
    if (!wallet || wallet.availableBalance <= 0) {
      return new Response("No balance to pay", { status: 400 });
    }

    const payoutAmount = wallet.availableBalance;

    // Run as a transaction so both happen together
    const [updatedWallet, newTransaction] = await prisma.$transaction([
      prisma.wallet.update({
        where: { astrologerId },
        data: { availableBalance: 0 }
      }),
      prisma.transaction.create({
        data: {
          userId: admin.id, // Record which admin paid
          astrologerId,
          amount: payoutAmount,
          astrologerCut: payoutAmount,
          platformCut: 0,
          type: "PAYOUT",
          status: "COMPLETED"
        }
      })
    ]);

    return Response.json({ success: true, wallet: updatedWallet, transaction: newTransaction });
  } catch (error) {
    console.error("Payout error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
