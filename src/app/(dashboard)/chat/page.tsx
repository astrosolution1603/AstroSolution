import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ChatClient from "./ChatClient";

export default async function ChatPage({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  const authSession = await auth();
  if (!authSession?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: authSession.user.id },
    include: { application: true },
  });

  if (user?.role === "ADMIN") {
    redirect("/masterpanel");
  }

  if (user?.role === "ASTROLOGER") {
    redirect("/astrologer");
  }

  if (user?.application) {
    redirect("/astrologer-register");
  }

  const [chatSessions, humanAstrologers] = await Promise.all([
    prisma.chatSession.findMany({
      where: { userId: authSession.user.id },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "ASTROLOGER" },
      select: { 
        id: true, 
        name: true,
        astrologerRating: true,
        astrologerExperience: true,
        astrologerPrice: true,
        astrologerSpecialties: true,
        astrologerLanguages: true
      },
      orderBy: {
        astrologerRating: 'desc'
      }
    })
  ]);

  const resolvedParams = await searchParams;
  let activeSessionId = resolvedParams?.session || null;

  const activeSession = chatSessions.find(s => s.id === activeSessionId) || chatSessions[0];
  
  // Fetch messages ONLY for the active session, dramatically improving load time
  let initialMessages: any[] = [];
  if (activeSession) {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: activeSession.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, role: true, content: true }
    });
    initialMessages = messages;
  }

  return (
    <ChatClient 
      sessions={chatSessions} 
      activeSessionId={activeSessionId}
      initialMessages={initialMessages}
      userName={user?.name || "Seeker"}
      astrologerId={(activeSession as any)?.astrologerUserId || (activeSession as any)?.astrologerId || null}
      humanAstrologers={humanAstrologers}
    />
  );
}
