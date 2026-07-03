import React from 'react';
import Link from 'next/link';

export function Logo({ className = "", size = "md" }: { className?: string, size?: "sm" | "md" | "lg" }) {
  const iconSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const omSize = size === "sm" ? "text-xl" : size === "lg" ? "text-3xl" : "text-2xl";
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <Link href="/" className={`flex items-center gap-2 group cursor-pointer ${className}`}>
      {/* Premium Vedic Mark */}
      <div className={`relative ${iconSize} rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[2px] flex-shrink-0 shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all duration-300`}>
        <div className="w-full h-full bg-black rounded-full flex items-center justify-center relative overflow-hidden">
          <span className={`${omSize} text-amber-400 font-serif leading-none mt-0.5 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]`}>ॐ</span>
          <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* High-End Typography */}
      <div className="flex items-center pt-1">
        <span className={`${textSize} tracking-[0.05em] font-black bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text drop-shadow-sm uppercase`}>
          ASTRO
        </span>
        <span className={`${textSize} tracking-[0.15em] font-light text-amber-500/90 uppercase ml-1 drop-shadow-sm`}>
          SOLUTION
        </span>
      </div>
    </Link>
  );
}
