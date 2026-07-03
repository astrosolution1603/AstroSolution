"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { NotificationBell } from "@/components/ui/NotificationBell";

const BOTTOM_TABS = [
  { icon: "💬", label: "Chat", href: "/chat" },
  { icon: "☸️", label: "Kundli", href: "/kundli" },
  { icon: "♈", label: "Horoscope", href: "/horoscope" },
  { icon: "💞", label: "Match", href: "/match" },
  { icon: "👤", label: "Profile", href: "/profile" },
];

const ALL_ITEMS = [
  { icon: "💬", label: "Chat", href: "/chat" },
  { icon: "☸️", label: "Kundli", href: "/kundli" },
  { icon: "♈", label: "Horoscope", href: "/horoscope" },
  { icon: "💞", label: "Match", href: "/match" },
  { icon: "💎", label: "Gem Store", href: "/shop" },
  { icon: "🃏", label: "Tarot", href: "/tarot" },
  { icon: "📅", label: "Panchang", href: "/panchang" },
  { icon: "🛕", label: "e-Pooja", href: "/pooja" },
  { icon: "👤", label: "Profile", href: "/profile" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button aria-label="Open navigation menu" onClick={() => setIsOpen(true)} className="text-foreground p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="sm:hidden"><Logo size="sm" /></div>
          <div className="hidden sm:block"><Logo size="md" /></div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-64 bg-white dark:bg-slate-950 h-full border-r border-slate-200 dark:border-white/10 flex flex-col transform transition-transform">
            <div className="p-4 flex justify-end">
              <button aria-label="Close navigation menu" onClick={() => setIsOpen(false)} className="text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-4 pb-4">
              <Logo size="sm" />
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
              {ALL_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                      isActive
                        ? "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-500 border dark:border-amber-500/30"
                        : "text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                    )}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-white/10 text-center">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-200 dark:border-white/10 flex items-center justify-around p-2 pb-safe z-40">
        {BOTTOM_TABS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg min-w-[4rem]",
                isActive ? "text-amber-600 dark:text-amber-500" : "text-slate-500 dark:text-foreground/50 hover:text-slate-800 dark:hover:text-foreground/80"
              )}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
