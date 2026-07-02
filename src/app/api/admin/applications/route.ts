import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const applications = await prisma.astrologerApplication.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ applications });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { applicationId, action } = await req.json();

  if (!applicationId || typeof applicationId !== "string" || !["APPROVE", "REJECT"].includes(action)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const application = await prisma.astrologerApplication.update({
    where: { id: applicationId },
    data: { status: action === "APPROVE" ? "APPROVED" : "REJECTED" }
  });

  return NextResponse.json({ success: true, application });
}
