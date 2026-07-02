import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_THEMES = ["cosmic", "mystic", "royal", "ocean", "vedic", "midnight", "snowfall"];

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { themeName } = await req.json();

    if (!themeName || !VALID_THEMES.includes(themeName)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }

    const updated = await prisma.platformSettings.upsert({
      where: { id: "global" },
      update: { themeName },
      create: { id: "global", themeName },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Theme Update Error:", error);
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
  }
}
