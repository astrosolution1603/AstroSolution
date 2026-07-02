import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { gemstones } from "@/lib/gemstones";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items, shippingAddress, utrNumber } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Server-side price recalculation — never trust client prices
    let serverTotal = 0;
    const validatedItems: { id: string; name: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      if (!item.id || typeof item.id !== "string") {
        return NextResponse.json({ error: "Invalid item" }, { status: 400 });
      }
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty < 1 || qty > 10) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      }
      const gem = gemstones.find((g) => g.id === item.id);
      if (!gem) {
        return NextResponse.json({ error: `Unknown item: ${item.id}` }, { status: 400 });
      }
      serverTotal += gem.price * qty;
      validatedItems.push({ id: gem.id, name: gem.name, quantity: qty, price: gem.price });
    }

    // Fetch global payment settings
    const settings = await prisma.paymentSettings.findUnique({ where: { id: "global" } });
    const activeMethod = settings?.activeMethod || "SIMULATED";

    if (activeMethod === "SIMULATED" && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Simulated payments are disabled in production. Please configure Razorpay or Paytm in the Master Panel." }, { status: 403 });
    }

    let paymentStatus = "COMPLETED";
    if (activeMethod === "MANUAL_UPI_QR") {
      paymentStatus = "PENDING";
      if (!utrNumber || typeof utrNumber !== "string" || utrNumber.trim().length < 6) {
        return NextResponse.json({ error: "Valid UTR number is required for manual UPI payments" }, { status: 400 });
      }
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: serverTotal, // Always server-calculated
        shippingAddress,
        paymentStatus,
        paymentMethod: activeMethod,
        utrNumber: utrNumber?.trim(),
        items: {
          create: validatedItems.map((item) => ({
            gemId: item.id,
            gemName: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, orderId: order.id, status: paymentStatus, total: serverTotal });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
