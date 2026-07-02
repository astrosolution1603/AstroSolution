import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { application: true },
  });

  // Redirect special roles to their own panels
  if (user?.role === "ADMIN") {
    redirect("/masterpanel");
  }

  if (user?.role === "ASTROLOGER") {
    redirect("/astrologer");
  }

  // If they have registered as an astrologer, keep them in the registration/status page
  if (user?.application) {
    redirect("/astrologer-register");
  }

  if (!user?.profileComplete) {
    redirect("/register");
  }

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <MobileNav />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
