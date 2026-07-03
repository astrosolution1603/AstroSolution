import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This webhook is called by RevenueCat servers when a purchase succeeds on Google Play / App Store.
// Configure this URL (https://your-domain.com/api/webhooks/revenuecat) in your RevenueCat Dashboard.

export async function POST(req: Request) {
  try {
    // Optional: Verify Authorization header matches your RevenueCat webhook auth token
    const authHeader = req.headers.get("authorization");
    if (process.env.REVENUECAT_WEBHOOK_SECRET && authHeader !== process.env.REVENUECAT_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const event = body.event;

    if (!event) {
      return NextResponse.json({ error: "No event data" }, { status: 400 });
    }

    // Identify the user based on the App User ID used in Purchases.logIn()
    const userId = event.app_user_id;
    
    // Process only non-subscription purchases or initial subscription purchases
    if (event.type === "NON_RENEWING_PURCHASE" || event.type === "INITIAL_PURCHASE") {
      const productId = event.product_id;
      
      // Determine how much wallet balance to add based on the Google Play Product ID
      // Example: 'wallet_topup_500' -> adds 500
      let amountToAdd = 0;
      if (productId.startsWith("wallet_topup_")) {
        amountToAdd = parseInt(productId.replace("wallet_topup_", ""), 10);
      }

      if (amountToAdd > 0 && userId) {
        // Find or create wallet and add balance securely on the backend
        await prisma.userWallet.upsert({
          where: { userId: userId },
          update: { balance: { increment: amountToAdd } },
          create: { userId: userId, balance: amountToAdd }
        });

        // Record the transaction for accounting
        console.log(`[RevenueCat Webhook] Added ${amountToAdd} to user ${userId} via ${productId}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RevenueCat Webhook] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
