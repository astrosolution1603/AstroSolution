import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { 
      name, phone, otp, 
      dateOfBirth, timeOfBirth, placeOfBirth, 
      gender, maritalStatus, occupation, languagePreference, reasonForJoining 
    } = await req.json();

    if (!name || !phone || !otp) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Normalize phone
    let normalizedPhone = phone.replace(/[\s\-().]/g, "");
    normalizedPhone = normalizedPhone.replace(/^\+91/, "").replace(/^0091/, "").replace(/^\+/, "");
    if (normalizedPhone.length > 10) {
      normalizedPhone = normalizedPhone.slice(-10);
    }

    // Validate OTP
    const isMasterOtp = otp === "9999" && (process.env.NODE_ENV === "development" || process.env.ENABLE_MASTER_OTP === "true");
    
    if (!isMasterOtp) {
      const cachedOtp = await prisma.otpCache.findUnique({
        where: { phone: normalizedPhone }
      });

      if (!cachedOtp || cachedOtp.otp !== otp || cachedOtp.expiresAt < new Date()) {
        return new NextResponse(JSON.stringify({ error: "Invalid or expired OTP" }), { status: 400 });
      }
      // Note: We DO NOT delete the OTP here because signIn() will need to verify it again and delete it!
    }

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          { phone: normalizedPhone },
          { phone: `+91${normalizedPhone}` },
        ]
      }
    });

    const profileData = {
      name,
      ...(dateOfBirth ? { dateOfBirth: new Date(dateOfBirth) } : {}),
      ...(timeOfBirth ? { timeOfBirth } : {}),
      ...(placeOfBirth ? { placeOfBirth } : {}),
      ...(gender ? { gender } : {}),
      ...(maritalStatus ? { maritalStatus } : {}),
      ...(occupation ? { occupation } : {}),
      ...(languagePreference ? { languagePreference } : {}),
      ...(reasonForJoining ? { reasonForJoining } : {}),
      profileComplete: true
    };

    if (user) {
      // If user exists, update their name and profile status
      user = await prisma.user.update({
        where: { id: user.id },
        data: profileData
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          ...profileData,
          phone: normalizedPhone,
          role: "USER"
        }
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return new NextResponse(JSON.stringify({ error: "Registration failed. Please try again." }), { status: 500 });
  }
}
