"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

interface HoroscopeClientProps {
  sign: string;
}

export default function HoroscopeClient({ sign }: HoroscopeClientProps) {
  const [horoscopeText, setHoroscopeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateHoroscope = async () => {
    setIsLoading(true);
    setHasGenerated(true);
    setHoroscopeText("");

    try {
      const res = await fetch("/api/horoscope/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sign }),
      });

      if (!res.ok || !res.body) {
        setHoroscopeText("Failed to generate horoscope. Please try again.");
        setIsLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const text = JSON.parse(line.slice(2));
              fullText += text;
              setHoroscopeText(fullText);
            } catch {
              // Malformed line — skip
            }
          }
        }
      }
    } catch {
      setHoroscopeText("An error occurred while reading the stars.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSections = () => {
    if (!horoscopeText && isLoading) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
          <div className="flex space-x-2 mb-4">
            <span className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-amber-600 dark:text-amber-400 font-medium">Reading the stars for {sign}...</p>
        </div>
      );
    }

    if (!hasGenerated) {
      return (
        <div className="col-span-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 text-center space-y-6 shadow-sm dark:shadow-none">
          <p className="text-slate-600 dark:text-white/80 leading-relaxed">
            Generate your hyper-personalized daily horoscope based on your exact Kundli transits.
          </p>
          <button 
            onClick={generateHoroscope}
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            Generate Today's Horoscope
          </button>
        </div>
      );
    }

    // Parse the generated markdown-ish text into sections
    return (
      <div className="col-span-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 text-left shadow-sm dark:shadow-none prose prose-amber dark:prose-invert max-w-none">
        {horoscopeText.split("\n\n").map((paragraph, idx) => {
          if (paragraph.startsWith("##") || paragraph.startsWith("**") || paragraph.includes("❤️") || paragraph.includes("💼") || paragraph.includes("💰") || paragraph.includes("🌿")) {
             return <h3 key={idx} className="font-bold text-lg text-slate-800 dark:text-amber-400 mt-6 mb-2 border-b border-border pb-2">{paragraph.replace(/#/g, "").replace(/\*\*/g, "")}</h3>;
          }
          return <p key={idx} className="text-slate-600 dark:text-white/80 mb-4">{paragraph}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {hasGenerated && (
        <div className="flex justify-center mb-4">
          <button 
            onClick={generateHoroscope}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-card hover:bg-amber-50 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold rounded-xl transition-all border border-amber-200 dark:border-amber-500/30 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Regenerating..." : "Regenerate Horoscope"}
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {renderSections()}
      </div>
    </div>
  );
}
