import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: list all astrologer users
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") return new Response("Forbidden", { status: 403 });

  const astrologers = await prisma.user.findMany({
    where: { role: "ASTROLOGER" },
    select: { 
      id: true, 
      name: true, 
      phone: true, 
      createdAt: true, 
      profileComplete: true,
      subscriptionStatus: true,
      subscriptionExpiry: true
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(astrologers);
}

// PUT: update astrologer subscription status
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const adminUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (adminUser?.role !== "ADMIN") return new Response("Forbidden", { status: 403 });

  const { id, subscriptionStatus } = await req.json();
  if (!id || typeof id !== "string" || !subscriptionStatus) {
    return new Response("Missing required fields", { status: 400 });
  }

  const VALID_STATUSES = ["ACTIVE", "INACTIVE", "EXPIRED"];
  if (!VALID_STATUSES.includes(subscriptionStatus)) {
    return new Response("Invalid subscriptionStatus", { status: 400 });
  }

  // If activating, extend expiry by 30 days from now
  let subscriptionExpiry = undefined;
  if (subscriptionStatus === "ACTIVE") {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    subscriptionExpiry = expiry;
  }

  const astrologer = await prisma.user.update({
    where: { id },
    data: {
      subscriptionStatus,
      ...(subscriptionExpiry && { subscriptionExpiry })
    },
  });

  return Response.json({ success: true, astrologer });
}

// DELETE: remove an astrologer
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const adminUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (adminUser?.role !== "ADMIN") return new Response("Forbidden", { status: 403 });

  const { id } = await req.json();
  if (!id || typeof id !== "string") {
    return new Response("Invalid id", { status: 400 });
  }
  await prisma.user.delete({ where: { id } });
  return Response.json({ success: true });
}
