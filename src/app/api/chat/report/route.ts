import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { astrologerId, category, description } = await req.json();

    if (!astrologerId || !category || !description) {
      return NextResponse.json({ error: "Missing report parameters" }, { status: 400 });
    }

    // Check if it's a human astrologer
    const astrologer = await prisma.user.findUnique({
      where: { id: astrologerId }
    });

    if (!astrologer || astrologer.role !== "ASTROLOGER") {
      return NextResponse.json({ success: true, message: "Report noted for AI." });
    }

    // Save the report
    await prisma.report.create({
      data: {
        userId: session.user.id,
        astrologerId,
        category,
        description
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Report Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
