import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chatSessions = await prisma.chatSession.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 1,
        }
      }
    });

    return NextResponse.json(chatSessions);
  } catch (error) {
    console.error("Fetch sessions error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const title = body.title || "New Chat";
    const astrologerId = body.astrologerId || null;

    const chatSession = await prisma.chatSession.create({
      data: {
        userId: session.user.id,
        title,
        astrologerId,
      }
    });

    return NextResponse.json({
      id: chatSession.id,
      title: chatSession.title,
      astrologerId: chatSession.astrologerId,
      createdAt: chatSession.createdAt,
    });
  } catch (error) {
    console.error("Create session error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
