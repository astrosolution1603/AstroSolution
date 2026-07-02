import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.role !== "ASTROLOGER") {
      return new Response("Forbidden", { status: 403 });
    }

    // Process payment (Simulated)
    // Here you would normally integrate Stripe/Razorpay and verify the webhook
    
    // Activate subscription for 30 days
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "ACTIVE",
        subscriptionExpiry: expiry,
      }
    });

    return Response.json({ success: true, expiry });
  } catch (error) {
    console.error("Subscription renewal error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
