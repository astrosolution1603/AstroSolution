import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function KundliPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id as string },
  });

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your Kundli</h1>
        <p className="text-slate-600 dark:text-white/60">Your cosmic blueprint based on exact birth details.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Birth Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
              <span className="text-slate-500 dark:text-white/50">Date of Birth</span>
              <span className="text-slate-900 dark:text-white font-medium">{user?.dateOfBirth?.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
              <span className="text-slate-500 dark:text-white/50">Time of Birth</span>
              <span className="text-slate-900 dark:text-white font-medium">{user?.timeOfBirth || "Not provided"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
              <span className="text-slate-500 dark:text-white/50">Place of Birth</span>
              <span className="text-slate-900 dark:text-white font-medium">{user?.placeOfBirth}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
              <span className="text-slate-500 dark:text-white/50">Zodiac Sign</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">{user?.zodiacSign}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] shadow-sm dark:shadow-none">
          <div className="relative w-48 h-48 rounded-full border border-amber-500/30 flex items-center justify-center overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent"></div>
            {/* CSS placeholder chart */}
            <div className="w-full h-full border border-amber-500/20 absolute transform rotate-45"></div>
            <div className="w-full h-full border border-amber-500/20 absolute transform -rotate-45"></div>
            <div className="w-full h-[1px] bg-amber-500/30 absolute"></div>
            <div className="h-full w-[1px] bg-amber-500/30 absolute"></div>
            <span className="text-4xl relative z-10 opacity-80">🕉️</span>
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your Kundli Analysis</h2>
          <Link href="/chat?prompt=Please analyze my complete kundli and tell me about my life path, strengths, and challenges"
                className="mt-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors">
            Generate AI Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}
