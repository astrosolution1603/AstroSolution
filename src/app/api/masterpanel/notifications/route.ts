import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/push";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, body, url, target } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: "Missing title or body" }, { status: 400 });
    }

    let whereClause = {};
    if (target === "ASTROLOGER") {
      whereClause = { user: { role: "ASTROLOGER" } };
    } else if (target === "USER") {
      whereClause = { user: { role: "USER" } };
    }

    const subscriptions = await prisma.notificationSubscription.findMany({
      where: whereClause,
      select: { userId: true },
      distinct: ['userId']
    });

    const userIds = subscriptions.map(s => s.userId);

    // Send notifications in background
    Promise.allSettled(
      userIds.map(id => sendPushNotification(id, title, body, url || "/"))
    ).catch(console.error);

    return NextResponse.json({ success: true, count: userIds.length });
  } catch (error) {
    console.error("Admin notification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
