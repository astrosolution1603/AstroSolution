"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatClient({ sessions, activeSessionId, initialMessages, userName, astrologerId, humanAstrologers }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt");
  const [injectedPrompt, setInjectedPrompt] = useState<string | null>(null);

  useEffect(() => {
    if (prompt) {
      setInjectedPrompt(prompt);
      router.replace(`/chat?session=${activeSessionId}`);
    }
  }, [prompt, activeSessionId, router]);

  const handleSelectAstro = async (astroId: string) => {
    // Check if a session already exists for this astrologer
    const existingSession = sessions.find((s: any) => s.astrologerId === astroId);
    
    if (existingSession) {
      router.push(`/chat?session=${existingSession.id}`);
      router.refresh();
      return;
    }

    // Otherwise create a new one
    const res = await fetch("/api/chat/sessions", { 
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ astrologerId: astroId })
    });
    
    if (res.ok) {
      const data = await res.json();
      router.push(`/chat?session=${data.id}`);
      router.refresh();
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] md:h-[calc(100vh)]">
      <div className={`w-full md:w-auto md:block ${activeSessionId ? 'hidden' : 'block'}`}>
        <ChatSidebar 
          sessions={sessions} 
          activeSessionId={activeSessionId} 
          onSelectAstro={handleSelectAstro} 
          humanAstrologers={humanAstrologers}
        />
      </div>
      <div className={`flex-1 overflow-hidden relative ${!activeSessionId ? 'hidden md:block' : 'block'}`}>
        <ChatWindow 
          key={activeSessionId}
          sessionId={activeSessionId}
          initialMessages={initialMessages}
          userName={userName}
          injectedPrompt={injectedPrompt}
          astrologerId={astrologerId}
          humanAstrologers={humanAstrologers}
        />
      </div>
    </div>
  );
}
