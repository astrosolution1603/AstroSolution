"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const THEMES = [
  {
    id: "cosmic",
    name: "Cosmic",
    desc: "✨ Space & Astrology — Stars, indigo, amber",
    gradient: "from-indigo-900 to-amber-500",
    bgClass: "bg-slate-900",
    buttonClass: "bg-amber-500 text-black hover:bg-amber-600"
  },
  {
    id: "mystic",
    name: "Mystic Forest",
    desc: "🌿 Earthy & Spiritual — Emerald, glassmorphism",
    gradient: "from-emerald-900 to-emerald-500",
    bgClass: "bg-[#0d2a1f]",
    buttonClass: "bg-emerald-500 text-white hover:bg-emerald-600"
  },
  {
    id: "royal",
    name: "Royal Palace",
    desc: "👑 Traditional Luxury — Crimson, gold, sharp edges",
    gradient: "from-rose-950 to-amber-500",
    bgClass: "bg-[#2a0d13]",
    buttonClass: "bg-amber-600 text-white hover:bg-amber-700 rounded-none"
  },
  {
    id: "ocean",
    name: "Ocean Zen",
    desc: "🌊 Calming Minimalist — Blue, pill-shaped, clean",
    gradient: "from-cyan-600 to-blue-900",
    bgClass: "bg-[#0d1b2a]",
    buttonClass: "bg-blue-500 text-white hover:bg-blue-600 rounded-full"
  },
  {
    id: "vedic",
    name: "Vedic Dawn",
    desc: "🕉️ Bright & Divine — Saffron, gold, warm glow",
    gradient: "from-orange-500 to-yellow-400",
    bgClass: "bg-orange-50/10",
    buttonClass: "bg-orange-500 text-white hover:bg-orange-600"
  },
  {
    id: "midnight",
    name: "Midnight",
    desc: "🌑 Pure Dark — AMOLED black, neon accents",
    gradient: "from-black to-zinc-800 border-b border-cyan-500/50",
    bgClass: "bg-black",
    buttonClass: "bg-transparent border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black rounded-none shadow-[0_0_10px_rgba(6,182,212,0.5)]"
  },
  {
    id: "snowfall",
    name: "Snowfall",
    desc: "❄️ Pure Light — Clean white, soft pastels",
    gradient: "from-slate-100 to-sky-100",
    bgClass: "bg-white",
    buttonClass: "bg-sky-500 text-white hover:bg-sky-600 shadow-sm rounded-2xl"
  }
];

export default function ThemeSettingsClient({ initialTheme }: { initialTheme: string }) {
  const router = useRouter();
  const [activeTheme, setActiveTheme] = useState(initialTheme);
  const [isLoading, setIsLoading] = useState(false);

  const applyTheme = async (themeId: string) => {
    setActiveTheme(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/masterpanel/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeName: themeId })
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🎨 Global Theme Engine</h1>
        <p className="text-white/60 max-w-2xl">
          Change the look and feel of the entire Astro Solution platform instantly.
          This will apply to all users globally. Note: Dark and Light modes are respected across all themes except Midnight (always dark) and Snowfall (always light).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEMES.map(theme => (
          <div
            key={theme.id}
            className={cn(
              "relative flex flex-col bg-card rounded-2xl border transition-all overflow-hidden",
              activeTheme === theme.id
                ? "border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)] scale-[1.02]"
                : "border-white/10 hover:border-white/20"
            )}
          >
            {/* Color Gradient Strip */}
            <div className={cn("h-16 w-full bg-gradient-to-r", theme.gradient)} />

            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground">{theme.desc}</p>
                </div>
                {activeTheme === theme.id && (
                  <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                    ACTIVE
                  </span>
                )}
              </div>

              {/* Preview Mini UI */}
              <div className={cn("w-full h-24 rounded-xl mb-6 border border-white/10 flex flex-col p-4 relative overflow-hidden", theme.bgClass)}>
                <div className="w-1/3 h-3 bg-white/20 rounded mb-3" />
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-2 bg-white/20 rounded" />
                    <div className="w-1/2 h-2 bg-white/20 rounded" />
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => applyTheme(theme.id)}
                  disabled={isLoading || activeTheme === theme.id}
                  className={cn(
                    "w-full py-3 px-4 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    theme.buttonClass,
                    activeTheme === theme.id ? "opacity-50" : ""
                  )}
                  style={activeTheme === theme.id ? { cursor: 'default' } : {}}
                >
                  {activeTheme === theme.id ? "Currently Active" : "Activate Theme"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
