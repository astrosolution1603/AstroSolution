"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { WalletMini } from "@/components/ui/WalletMini";

const NAV_ITEMS = [
  { icon: "💬", label: "Chat", desc: "AI Astrologer", href: "/chat" },
  { icon: "💎", label: "Gem Store", desc: "Buy Astro Stones", href: "/shop" },
  { icon: "☸️", label: "Kundli", desc: "Birth chart", href: "/kundli" },
  { icon: "♈", label: "Horoscope", desc: "Daily & Weekly", href: "/horoscope" },
  { icon: "💞", label: "Kundli Match", desc: "Compatibility", href: "/match" },
  { icon: "🃏", label: "Tarot", desc: "Card reading", href: "/tarot" },
  { icon: "📅", label: "Panchang", desc: "Daily almanac", href: "/panchang" },
  { icon: "🛕", label: "e-Pooja", desc: "Online Rituals", href: "/pooja" },
  { icon: "👤", label: "Profile", desc: "Your details", href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="w-64 bg-card border-r border-border hidden md:flex flex-col h-screen backdrop-blur-xl">
      <div className="p-6 border-b border-border flex items-center justify-center">
        <Logo className="scale-90 origin-left" />
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                isActive
                  ? "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-500 border dark:border-amber-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
              )}
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{item.label}</span>
                <span className={cn("text-[10px]", isActive ? "text-amber-600 dark:text-amber-500/70" : "text-muted-foreground/70")}>
                  {item.desc}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex justify-center mb-4">
          <WalletMini />
        </div>
        <div className="bg-muted border border-border rounded-xl p-4 flex flex-col items-center relative">
          <div className="absolute right-2 top-2 flex items-center gap-1">
            <NotificationBell />
            <ThemeToggle />
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-3">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
          <div className="text-sm font-medium text-foreground text-center w-full truncate">
            {session?.user?.name}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
