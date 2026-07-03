import { cn } from "@/lib/utils";
import { astrologers } from "@/lib/astrologers";
import { MessageSquare, Star } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface Session {
  id: string;
  title: string;
  updatedAt: string | Date;
  astrologerId?: string | null;
}

interface ChatSidebarProps {
  sessions: Session[];
  activeSessionId?: string;
  onSelectAstro: (astrologerId: string) => void;
  humanAstrologers?: { id: string; name: string }[];
}

export default function ChatSidebar({ sessions, activeSessionId, onSelectAstro, humanAstrologers = [] }: ChatSidebarProps) {
  // Merge Human Astrologers (from DB) with AI Astrologers
  const allAstrologers = [
    ...humanAstrologers.map((h: any) => ({
      id: h.id,
      name: h.name,
      avatar: "🧑‍💼", // default avatar for human astrologers
      gradient: "from-green-500 to-emerald-600",
      isHuman: true,
      category: h.astrologerSpecialties || "Vedic Astrology",
      languages: h.astrologerLanguages || "hindi, english",
      rating: h.astrologerRating || 5.0,
      experience: `${h.astrologerExperience || 0} years`,
      price: h.astrologerPrice || 20
    })),
    ...astrologers.map((a, i) => ({ 
      ...a, 
      isHuman: false,
      category: "Tarot & Vedic",
      languages: "hindi",
      rating: 4.5 + (i % 5) * 0.1, // mock rating 4.5 - 4.9
      experience: `${5 + (i % 10)} years`, // mock 5-14 years
      price: 20
    }))
  ];

  return (
    <div className="w-full md:w-80 lg:w-96 flex flex-col h-[calc(100vh-4rem)] md:h-full bg-slate-50 overflow-hidden relative font-sans">
      
      {/* Mobile Top Header (Gradient) */}
      <div className="md:hidden w-full bg-gradient-to-b from-[#FFA785] to-[#FFDBCC]/40 pt-4 pb-20 px-4 flex justify-between items-center shrink-0">
        <h1 className="text-xl font-black text-slate-900">Astrologers</h1>
      </div>



      {/* Astrologer List Feed */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 md:pb-4 space-y-4 -mt-16 md:mt-0 relative z-10">
        {allAstrologers.map(astro => {
          const isActive = activeSessionId === astro.id;

          return (
            <div
              key={astro.id}
              className={cn(
                "w-full bg-white rounded-2xl shadow-sm border p-4 flex flex-col gap-4",
                isActive ? "border-orange-500/50 shadow-orange-500/10" : "border-slate-100"
              )}
            >
              {/* Top Row: Avatar & Info */}
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl shrink-0 border border-slate-200">
                  {astro.avatar}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-bold text-slate-900 text-lg truncate flex items-center gap-2">
                    {astro.name}
                    {astro.isHuman && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live"></span>}
                  </h3>
                  <p className="text-sm text-slate-500 truncate">{astro.category}</p>
                  <p className="text-sm text-slate-400 truncate capitalize">{astro.languages}</p>
                </div>
              </div>

              {/* Middle Row: Stats */}
              <div className="flex items-center justify-between px-2 pt-2 pb-2">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 fill-slate-800 text-slate-800" />
                    {astro.rating.toFixed(1)}
                  </div>
                  <span className="text-xs text-slate-500">Rating</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="font-bold text-slate-800">{astro.experience}</div>
                  <span className="text-xs text-slate-500">Experience</span>
                </div>
              </div>

              {/* Bottom Row: Chat Action */}
              <button
                onClick={() => onSelectAstro(astro.id)}
                className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
            </div>
          );
        })}
      </div>



    </div>
  );
}
