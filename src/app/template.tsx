"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Show loading animation on every route shift
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); // 400ms native app feel

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative flex items-center justify-center w-28 h-28">
            <div className="absolute inset-0 rounded-full border-[3px] border-amber-200/30 dark:border-amber-900/30 border-t-amber-500 border-r-amber-500 animate-spin" style={{ animationDuration: '1s' }}></div>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-pulse">
              <span className="text-black/80 font-serif text-5xl leading-none mt-1">ॐ</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="text-sm font-black tracking-[0.2em] uppercase text-slate-800 dark:text-slate-200 animate-pulse">
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-transparent bg-clip-text">Astro</span> Solution
            </span>
          </div>
        </div>
      )}
      <div className={`w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100 animate-in fade-in zoom-in-[0.98] ease-out'}`}>
        {children}
      </div>
    </>
  );
}
