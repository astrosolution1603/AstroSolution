import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AstrologerClient from "./AstrologerClient";
import SubscriptionLockout from "./SubscriptionLockout";

export default async function AstrologerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user || (user.role !== "ASTROLOGER" && user.role !== "ADMIN")) {
    redirect("/chat");
  }

  const isExpired = user.role === "ASTROLOGER" && (
    user.subscriptionStatus === "INACTIVE" || 
    (user.subscriptionExpiry && user.subscriptionExpiry < new Date())
  );

  if (isExpired) {
    return <SubscriptionLockout name={user.name} expiry={user.subscriptionExpiry?.toISOString()} phone={user.phone || ""} />;
  }

  return <AstrologerClient astrologerName={user.name} astrologerId={user.id} />;
}
