import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { poojaId, poojaTitle } = await req.json();

    if (!poojaId || typeof poojaId !== "string" || !poojaTitle) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Server-side price lookup — never trust client-provided price
    const POOJA_PRICES: Record<string, number> = {
      "basic_sankalp": 501,
      "navagraha": 2100,
      "maha_mrityunjaya": 11000,
      "kaal_sarp": 21000,
      "ati_rudra": 51000,
    };

    const price = POOJA_PRICES[poojaId];
    if (price === undefined) {
      return new NextResponse("Invalid poojaId", { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.walletBalance < price) {
      return new NextResponse("Insufficient Astro Wallet balance. Please top up.", { status: 402 });
    }

    // Deduct balance and create booking in a transaction
    const [booking, updatedUser] = await prisma.$transaction([
      prisma.poojaBooking.create({
        data: {
          userId: session.user.id,
          poojaId,
          poojaTitle,
          price, // Always use server-side price
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { walletBalance: { decrement: price } }
      })
    ]);

    return NextResponse.json({ success: true, booking, newBalance: updatedUser.walletBalance });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
