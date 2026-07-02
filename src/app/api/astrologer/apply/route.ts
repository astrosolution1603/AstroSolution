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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "ASTROLOGER") {
      return NextResponse.json({ error: "You are already an astrologer" }, { status: 400 });
    }

    if (user.application) {
      return NextResponse.json({ error: "Application already exists" }, { status: 400 });
    }

    const body = await req.json();
    const { experienceYears, specialties, languages } = body;

    if (experienceYears == null || !specialties || !languages) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const application = await prisma.astrologerApplication.create({
      data: {
        userId: user.id,
        experienceYears: Number(experienceYears),
        specialties,
        languages,
        status: "PENDING",
        paymentStatus: "UNPAID"
      }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Apply Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
