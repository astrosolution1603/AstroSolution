import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { calculateZodiacSign } from "@/lib/astro-prompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, phone, email, dateOfBirth, timeOfBirth, placeOfBirth, 
      gender, maritalStatus, occupation, languagePreference, reasonForJoining 
    } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 400 });
    }

    let zodiacSign = null;
    let dobDate = null;
    let profileComplete = false;

    if (dateOfBirth) {
      dobDate = new Date(dateOfBirth);
      zodiacSign = calculateZodiacSign(dobDate);
      if (placeOfBirth) {
        profileComplete = true;
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || null,
        dateOfBirth: dobDate,
        timeOfBirth,
        placeOfBirth,
        gender,
        maritalStatus,
        occupation,
        languagePreference: languagePreference || "english",
        reasonForJoining,
        zodiacSign,
        profileComplete,
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, name: user.name, phone: user.phone } 
    });
  } catch (error) {
    console.error("User registration error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
