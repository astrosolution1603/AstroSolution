"use client";

import { useState } from "react";
import { Palette, X } from "lucide-react";
import { useRouter } from "next/navigation";

const themes = [
  { id: "cosmic", name: "Cosmic", colors: ["#312e81", "#f59e0b"] },
  { id: "mystic", name: "Mystic", colors: ["#064e3b", "#10b981"] },
  { id: "royal", name: "Royal", colors: ["#7f1d1d", "#fcd34d"] },
  { id: "ocean", name: "Ocean", colors: ["#0c4a6e", "#38bdf8"] },
  { id: "vedic", name: "Vedic", colors: ["#9a3412", "#fb923c"] },
  { id: "midnight", name: "Midnight", colors: ["#000000", "#a855f7"] },
  { id: "snowfall", name: "Snowfall", colors: ["#ffffff", "#60a5fa"] },
];

export default function DemoThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const changeTheme = (themeId: string) => {
    // Force DOM updates for immediate preview without hitting DB or requiring Admin login
    document.documentElement.setAttribute('data-theme', themeId);
    
    // Find the background div and update its class
    const bgDivs = document.querySelectorAll('div[class*="theme-bg-"]');
    bgDivs.forEach(div => {
      // Remove all existing theme-bg classes
      themes.forEach(t => div.classList.remove(`theme-bg-${t.id}`));
      // Add the new one
      div.classList.add(`theme-bg-${themeId}`);
    });
    
    // next-themes handling for forced themes (midnight/snowfall)
    if (themeId === 'midnight') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    } else if (themeId === 'snowfall') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    } else {
      // Fallback to system or user preference for others, for demo just use dark
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100] md:bottom-6">
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-4 bg-background/80 backdrop-blur-3xl border border-foreground/10 rounded-[32px] p-4 shadow-2xl w-64 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-foreground text-sm">Preview Themes</h3>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                className="w-full flex items-center gap-3 p-2 rounded-[20px] hover:bg-foreground/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full shadow-inner flex overflow-hidden shrink-0 border border-foreground/10 group-hover:scale-110 transition-transform">
                  <div className="w-1/2 h-full" style={{ backgroundColor: t.colors[0] }}></div>
                  <div className="w-1/2 h-full" style={{ backgroundColor: t.colors[1] }}></div>
                </div>
                <span className="text-sm font-medium text-foreground">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-foreground text-background rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all border border-foreground/10"
      >
        <Palette className="w-6 h-6" />
      </button>
    </div>
  );
}
