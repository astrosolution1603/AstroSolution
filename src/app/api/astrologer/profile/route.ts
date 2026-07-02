import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      bankAccountHolder, 
      bankAccountNumber, 
      bankIfscCode, 
      bankName 
    } = await req.json();

    // Verify astrologer role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== "ASTROLOGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update bank details
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bankAccountHolder,
        bankAccountNumber,
        bankIfscCode,
        bankName
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
