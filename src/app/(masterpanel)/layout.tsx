import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import LogoutButton from "@/components/auth/LogoutButton";
import { BellRing } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-200 flex flex-col items-start gap-3">
          <Logo className="scale-75 origin-left -ml-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Admin Panel</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/masterpanel" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            📊 Dashboard
          </Link>
          <Link href="/masterpanel/users" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            👥 Manage Users
          </Link>
          <Link href="/masterpanel/astrologers" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            🔮 Manage Astrologers
          </Link>
          <Link href="/masterpanel/applications" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            📝 Applications
          </Link>
          <Link href="/masterpanel/earnings" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            💰 Earnings & Payouts
          </Link>
          <Link href="/masterpanel/theme" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            🎨 Theme Engine
          </Link>
          <Link href="/masterpanel/payments" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            💳 Payment Settings
          </Link>
          <Link href="/masterpanel/notifications" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            <BellRing className="w-4 h-4 inline mr-2" /> Push Notifications
          </Link>
          <Link href="/masterpanel/settings" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            ⚙️ Platform Settings
          </Link>
          <Link href="/masterpanel/orders" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            📦 Gemstone Orders
          </Link>
          <Link href="/masterpanel/reports" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
            ⚠️ Reports
          </Link>
          
          <div className="pt-8 space-y-2">
            <Link href="/chat" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900 transition-colors">
              ← Back to App
            </Link>
            <div className="px-4">
              <LogoutButton />
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
