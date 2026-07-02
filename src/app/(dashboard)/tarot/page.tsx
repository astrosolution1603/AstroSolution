"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TarotPage() {
  const router = useRouter();
  const [isDrawn, setIsDrawn] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const drawCards = async () => {
    setIsAnimating(true);
    
    // Create a new session with the Tarot astrologer (id: "meera")
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ astrologerId: "meera", title: "Tarot Reading" })
      });
      
      if (res.ok) {
        const data = await res.json();
        setTimeout(() => {
          setIsAnimating(false);
          setIsDrawn(true);
          setTimeout(() => {
            router.push(`/chat?session=${data.id}&prompt=I just drew a 3-card tarot spread for my Past, Present, and Future. Please draw the cards for me virtually and interpret my reading.`);
          }, 1500);
        }, 2000);
      }
    } catch (e) {
      setIsAnimating(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-12 text-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">AI Tarot Reading</h1>
        <p className="text-slate-600 dark:text-white/60">Ask the cards for intuitive guidance on your path.</p>
      </div>

      <div className="flex justify-center gap-4 md:gap-8 min-h-[300px] items-center perspective-1000">
        {['Past', 'Present', 'Future'].map((pos, i) => (
          <div key={pos} className="flex flex-col items-center gap-4">
            <div className={`w-24 h-40 md:w-32 md:h-56 rounded-xl border border-amber-300 dark:border-amber-500/30 transition-all duration-1000 transform-style-3d ${isDrawn ? 'rotate-y-180' : ''} ${isAnimating ? `animate-pulse delay-${i*100}` : ''}`}>
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-100 to-slate-200 dark:from-indigo-900 dark:to-slate-900 flex items-center justify-center rounded-xl border border-slate-300 dark:border-white/20">
                <span className="text-2xl opacity-50">✨</span>
              </div>
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-slate-800 flex items-center justify-center rounded-xl border border-amber-500/50">
                <span className="text-4xl animate-bounce">🔮</span>
              </div>
            </div>
            <span className="text-slate-600 dark:text-white/60 font-medium">{pos}</span>
          </div>
        ))}
      </div>

      {!isDrawn && !isAnimating && (
        <Button onClick={drawCards} className="px-8 py-6 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-lg shadow-lg">
          Shuffle & Draw 3 Cards
        </Button>
      )}

      {isAnimating && (
        <p className="text-amber-600 dark:text-amber-400 animate-pulse">Channeling cosmic energy...</p>
      )}
      
      {isDrawn && (
        <p className="text-green-600 dark:text-green-400">Cards drawn! AI is interpreting your reading...</p>
      )}
    </div>
  );
}
