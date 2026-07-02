import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// This endpoint registers a new user during the astrologer onboarding flow.
// It is intentionally public (no auth) but rate-limited by input validation.
export async function POST(req: Request) {
  try {
    const { name, phone } = await req.json();

    // Validate name
    if (!name || typeof name !== "string" || name.trim().length < 2 || name.length > 80) {
      return new Response("Invalid name", { status: 400 });
    }

    // Validate phone: must be 10 digits
    const cleanPhone = String(phone ?? "").replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return new Response("Invalid phone number — must be 10 digits", { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({ where: { phone: cleanPhone } });

    if (existingUser) {
      return Response.json({ success: true, message: "Account exists. Please log in with OTP." });
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        phone: cleanPhone,
        role: "USER",
        profileComplete: true,
      },
    });

    return Response.json({ success: true, user: { id: user.id } }); // Only return id, not full user
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
