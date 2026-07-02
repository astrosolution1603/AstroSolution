import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { astrologerId, rating, feedback } = await req.json();

    if (!astrologerId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating parameters" }, { status: 400 });
    }

    // Check if it's a human astrologer
    const astrologer = await prisma.user.findUnique({
      where: { id: astrologerId }
    });

    if (!astrologer || astrologer.role !== "ASTROLOGER") {
      // If it's an AI, we can just return success or save a dummy review, but for now we'll just return success.
      return NextResponse.json({ success: true, message: "Thanks for rating the AI!" });
    }

    // Save the review
    await prisma.review.create({
      data: {
        userId: session.user.id,
        astrologerId,
        rating,
        feedback: feedback || ""
      }
    });

    // Recalculate average rating
    const allReviews = await prisma.review.findMany({
      where: { astrologerId },
      select: { rating: true }
    });

    const avgRating = allReviews.reduce((acc, rev) => acc + rev.rating, 0) / allReviews.length;

    // Update astrologer profile
    await prisma.user.update({
      where: { id: astrologerId },
      data: { astrologerRating: avgRating }
    });

    return NextResponse.json({ success: true, avgRating });
  } catch (error) {
    console.error("Rating Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
