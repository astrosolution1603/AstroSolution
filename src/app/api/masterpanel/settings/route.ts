import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fast2smsKey, otpMessageTemplate, inAppNotificationsEnabled } = await req.json();

    const settings = await prisma.platformSettings.upsert({
      where: { id: "global" },
      update: {
        fast2smsKey,
        otpMessageTemplate,
        inAppNotificationsEnabled
      },
      create: {
        id: "global",
        fast2smsKey,
        otpMessageTemplate,
        inAppNotificationsEnabled: inAppNotificationsEnabled ?? true
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
