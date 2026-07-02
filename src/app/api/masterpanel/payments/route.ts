import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let settings = await prisma.paymentSettings.findUnique({
      where: { id: "global" }
    });

    if (!settings) {
      settings = await prisma.paymentSettings.create({
        data: { id: "global" }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Payment settings GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { activeMethod, upiId, merchantName, razorpayKey, razorpaySecret } = await req.json();

    const settings = await prisma.paymentSettings.upsert({
      where: { id: "global" },
      update: { activeMethod, upiId, merchantName, razorpayKey, razorpaySecret },
      create: { id: "global", activeMethod, upiId, merchantName, razorpayKey, razorpaySecret }
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Payment settings POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
