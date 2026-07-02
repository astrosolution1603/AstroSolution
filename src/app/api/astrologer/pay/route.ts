import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { application: true }
    });

    if (!user || !user.application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (user.application.status !== "APPROVED") {
      return NextResponse.json({ error: "Application is not approved yet" }, { status: 400 });
    }

    if (user.application.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Setup fee already paid" }, { status: 400 });
    }

    // Simulate payment processing...
    
    // 1. Update application payment status
    await prisma.astrologerApplication.update({
      where: { id: user.application.id },
      data: { paymentStatus: "PAID" }
    });

    // 2. Upgrade user role to ASTROLOGER, set profile fields, and grant 30-day subscription
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        role: "ASTROLOGER",
        astrologerRating: 5.0,
        astrologerExperience: user.application.experienceYears,
        astrologerSpecialties: user.application.specialties,
        astrologerLanguages: user.application.languages,
        astrologerPrice: 20, // Default price
        subscriptionStatus: "ACTIVE",
        subscriptionExpiry: expiryDate
      }
    });

    // 3. Initialize Astrologer Wallet
    await prisma.wallet.upsert({
      where: { astrologerId: user.id },
      update: {},
      create: {
        astrologerId: user.id,
        availableBalance: 0
      }
    });

    return NextResponse.json({ success: true, message: "Welcome Astrologer!" });
  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
