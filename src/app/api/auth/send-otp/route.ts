import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, isRegistering, isLogin } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Normalize phone number for DB check
    let normalizedPhone = phone.replace(/[\s\-().]/g, "");
    normalizedPhone = normalizedPhone.replace(/^\+91/, "").replace(/^0091/, "").replace(/^\+/, "");
    if (normalizedPhone.length > 10) {
      normalizedPhone = normalizedPhone.slice(-10);
    }

    // Pre-flight check: see if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          { phone: normalizedPhone },
          { phone: `+91${normalizedPhone}` }
        ]
      }
    });

    if (isRegistering && existingUser) {
      return NextResponse.json({ error: "Phone number already registered. Please login instead." }, { status: 400 });
    }

    if (isLogin && !existingUser) {
      return NextResponse.json({ error: "Phone number not found. Please register first." }, { status: 400 });
    }

    // Rate Limiting (Simple IP based would be best, but we'll limit by phone in DB)
    // Prevent sending more than 3 OTPs in 5 minutes
    const recentOtps = await prisma.otpCache.count({
      where: {
        phone,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000)
        }
      }
    });

    if (recentOtps >= 3) {
      return NextResponse.json({ error: "Too many OTP requests. Please try again later." }, { status: 429 });
    }

    const settings = await prisma.platformSettings.findUnique({
      where: { id: "global" }
    });

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    if (!settings || !settings.fast2smsKey) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Fast2SMS API Key is not configured. Skipping SMS dispatch. Use Master OTP 9999 to login.");
        console.log(`Generated OTP for ${phone}: ${otp}`);
      } else {
        console.error("CRITICAL: Fast2SMS API Key is not configured in production. SMS dispatch failed.");
      }
    } else {
      // Prepare message
      const template = settings.otpMessageTemplate || "Your Astro Solution OTP is {#OTP#}. Do not share this.";
      const message = template.replace("{#OTP#}", otp);

      // Send SMS via Fast2SMS
      const smsRes = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          "authorization": settings.fast2smsKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          route: "q",
          message: message,
          flash: 0,
          numbers: phone.replace(/[^0-9]/g, "").slice(-10) // Just the last 10 digits
        })
      });

      const smsData = await smsRes.json();
      
      if (!smsData.return) {
        console.error("Fast2SMS Error:", smsData);
        if (process.env.NODE_ENV === "development") {
          console.warn("Fast2SMS failed to send. Proceeding anyway. Use 9999 to login.");
        }
      }
    }

    // Save to Cache
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiration
    
    await prisma.otpCache.upsert({
      where: { phone },
      update: {
        otp,
        expiresAt,
        createdAt: new Date()
      },
      create: {
        phone,
        otp,
        expiresAt
      }
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
