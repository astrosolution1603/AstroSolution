import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      
      <div className="relative flex items-center justify-center w-28 h-28">
        {/* Outer Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-amber-200/30 dark:border-amber-900/30 border-t-amber-500 border-r-amber-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
        
        {/* Inner Pulsing Gradient & Om */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-pulse">
          <span className="text-black/80 font-serif text-5xl leading-none mt-1 drop-shadow-sm">ॐ</span>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <span className="text-sm font-black tracking-[0.2em] uppercase text-slate-800 dark:text-slate-200 animate-pulse">
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-transparent bg-clip-text">Astro</span> Solution
        </span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      
    </div>
  );
}
