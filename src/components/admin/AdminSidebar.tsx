"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import LogoutButton from "@/components/auth/LogoutButton";
import { BellRing, Menu, X } from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden w-full bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-50">
        <Logo className="scale-75 origin-left" />
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 focus:outline-none">
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 border-r border-slate-200 flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:shadow-sm md:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-200 flex flex-col items-start gap-3 relative">
          <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-4 right-4 p-2 text-slate-400">
            <X className="w-5 h-5" />
          </button>
          <Logo className="scale-75 origin-left -ml-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Admin Panel</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
          <Link onClick={() => setIsOpen(false)} href="/masterpanel" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            📊 Dashboard
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/masterpanel/users" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            👥 Manage Users
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/masterpanel/astrologers" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            🔮 Manage Astrologers
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/masterpanel/applications" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            📝 Applications
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/masterpanel/earnings" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            💰 Earnings & Payouts
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/masterpanel/theme" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            🎨 Theme Engine
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/masterpanel/payments" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            💳 Payment Settings
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/masterpanel/notifications" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            <BellRing className="w-4 h-4 inline mr-2" /> Push Notifications
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/masterpanel/settings" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            ⚙️ Platform Settings
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/masterpanel/orders" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            📦 Gemstone Orders
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/masterpanel/reports" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            ⚠️ Reports
          </Link>
          
          <div className="pt-8 space-y-2 pb-4">
            <Link href="/chat" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
              ← Back to App
            </Link>
            <div className="px-4">
              <LogoutButton />
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
