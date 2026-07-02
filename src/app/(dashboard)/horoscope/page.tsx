import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HoroscopeClient from "./HoroscopeClient";

export default async function HoroscopePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const sign = user?.zodiacSign || "Aries";

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-300 dark:border-amber-500/30 shadow-sm dark:shadow-none">
          <span className="text-4xl text-amber-600 dark:text-amber-400">{sign.charAt(0)}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your Horoscope</h1>
        <p className="text-xl text-amber-600 dark:text-amber-400 font-medium">{sign}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-black/20 p-1 rounded-xl">
        <div className="bg-white dark:bg-white/10 text-center py-2 rounded-lg text-slate-900 dark:text-white font-medium text-sm border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">Today</div>
        <div className="text-center py-2 rounded-lg text-slate-500 dark:text-white/50 font-medium text-sm">This Week</div>
        <div className="text-center py-2 rounded-lg text-slate-500 dark:text-white/50 font-medium text-sm">This Month</div>
      </div>

      <HoroscopeClient sign={sign} />
    </div>
  );
}
