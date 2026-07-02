import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { poojaId, poojaTitle } = await req.json();

    if (!poojaId || typeof poojaId !== "string" || !poojaTitle) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Server-side price lookup — never trust client-provided price
    const POOJA_PRICES: Record<string, number> = {
      "ganesh-puja": 2100,
      "navgrah-shanti": 5100,
      "satyanarayan-puja": 3100,
      "rudrabhishek": 4500,
      "mahamrityunjaya": 3500,
      "laxmi-puja": 2500,
      "durga-saptashati": 5100,
      "kaal-sarp-dosh": 4100,
      "mangal-dosh": 3700,
      "pitra-dosh": 3900,
    };

    const price = POOJA_PRICES[poojaId];
    if (price === undefined) {
      return new NextResponse("Invalid poojaId", { status: 400 });
    }

    const booking = await prisma.poojaBooking.create({
      data: {
        userId: session.user.id,
        poojaId,
        poojaTitle,
        price, // Always use server-side price
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
