import { Metadata } from "next";
import { Sparkles, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Gem Store - Astro Solution",
  description: "Astrological gemstones for your cosmic needs.",
};

export default function ShopPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 relative">
        <ShoppingBag className="w-10 h-10 text-amber-500" />
        <Sparkles className="w-6 h-6 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
        Astro Gemstore
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 dark:text-white/60 max-w-lg mb-8">
        We are curating a premium collection of authentic, energized astrological gemstones. 
      </p>

      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold tracking-widest uppercase text-sm">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        Coming Very Soon
      </div>
    </div>
  );
}
