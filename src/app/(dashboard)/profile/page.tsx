import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id as string },
  });

  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Profile</h1>
        <p className="text-slate-600 dark:text-white/60">Manage your personal and birth details.</p>
      </div>

      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <p className="text-slate-500 dark:text-white/50">{user?.email}</p>
            </div>
          </div>
          <div className="text-center bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2">
            <div className="text-2xl mb-1">♈</div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase">{user?.zodiacSign}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-slate-900 dark:text-white font-semibold border-b border-slate-200 dark:border-white/10 pb-2">Birth Details</h3>
            <div>
              <div className="text-xs text-slate-500 dark:text-white/40 mb-1">Date of Birth</div>
              <div className="text-slate-900 dark:text-white">{user?.dateOfBirth?.toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-white/40 mb-1">Time of Birth</div>
              <div className="text-slate-900 dark:text-white">{user?.timeOfBirth || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-white/40 mb-1">Place of Birth</div>
              <div className="text-slate-900 dark:text-white">{user?.placeOfBirth || "-"}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-slate-900 dark:text-white font-semibold border-b border-slate-200 dark:border-white/10 pb-2">Personal Details</h3>
            <div>
              <div className="text-xs text-slate-500 dark:text-white/40 mb-1">Gender</div>
              <div className="text-slate-900 dark:text-white">{user?.gender || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-white/40 mb-1">Marital Status</div>
              <div className="text-slate-900 dark:text-white">{user?.maritalStatus || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-white/40 mb-1">Occupation</div>
              <div className="text-slate-900 dark:text-white">{user?.occupation || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-white/40 mb-1">Language</div>
              <div className="text-slate-900 dark:text-white capitalize">{user?.languagePreference || "English"}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
          <Button variant="outline" className="bg-transparent border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 w-full sm:w-auto">
            Edit Profile Details
          </Button>
        </div>
      </div>
    </div>
  );
}
