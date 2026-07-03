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
  const [isNavigating, setIsNavigating] = useState<string | null>(null);

  useEffect(() => {
    if (prompt) {
      setInjectedPrompt(prompt);
      router.replace(`/chat?session=${activeSessionId}`);
    }
  }, [prompt, activeSessionId, router]);

  useEffect(() => {
    // Clear the navigating state once the active session updates
    setIsNavigating(null);
  }, [activeSessionId]);

  const handleSelectAstro = async (astroId: string) => {
    if (isNavigating) return;
    setIsNavigating(astroId);
    
    // Check if a session already exists for this astrologer
    const existingSession = sessions.find((s: any) => s.astrologerId === astroId);
    
    if (existingSession) {
      if (existingSession.id !== activeSessionId) {
        router.push(`/chat?session=${existingSession.id}`);
      } else {
        setIsNavigating(null);
      }
      return;
    }

    try {
      // Otherwise create a new one
      const res = await fetch("/api/chat/sessions", { 
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ astrologerId: astroId })
      });
      
      if (res.ok) {
        const data = await res.json();
        router.push(`/chat?session=${data.id}`);
      } else {
        setIsNavigating(null);
        alert("Failed to connect to astrologer. Please try again.");
      }
    } catch (e) {
      setIsNavigating(null);
      alert("Network error. Please check your connection.");
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className={`w-full md:w-auto md:block ${activeSessionId ? 'hidden' : 'block'}`}>
        <ChatSidebar 
          sessions={sessions} 
          activeSessionId={activeSessionId} 
          onSelectAstro={handleSelectAstro} 
          humanAstrologers={humanAstrologers}
          isNavigating={isNavigating}
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
