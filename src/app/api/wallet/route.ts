import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let userWallet = await prisma.userWallet.findUnique({
      where: { userId: session.user.id }
    });

    if (!userWallet) {
      userWallet = await prisma.userWallet.create({
        data: { userId: session.user.id, balance: 0 }
      });
    }

    return NextResponse.json({ balance: userWallet.balance });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount } = await req.json();
    const parsedAmount = parseInt(amount, 10);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Simulated payments are disabled in production. Please use a valid payment gateway." }, { status: 403 });
    }

    const userWallet = await prisma.userWallet.upsert({
      where: { userId: session.user.id },
      update: { balance: { increment: parsedAmount } },
      create: { userId: session.user.id, balance: parsedAmount }
    });

    return NextResponse.json({ success: true, balance: userWallet.balance });
  } catch (error) {
    console.error("Error topping up wallet:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
