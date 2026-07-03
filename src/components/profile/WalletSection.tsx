"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Plus } from "lucide-react";
import { Purchases } from "@revenuecat/purchases-capacitor";

export function WalletSection() {
  const [balance, setBalance] = useState<number | null>(null);
  const [isToppingUp, setIsToppingUp] = useState(false);

  useEffect(() => {
    fetch("/api/wallet")
      .then(res => res.json())
      .then(data => {
        if (data.balance !== undefined) setBalance(data.balance);
      })
      .catch(console.error);
  }, []);

  const handleTopUp = async (amount: number) => {
    setIsToppingUp(true);
    try {
      if (typeof window !== "undefined" && (window as any).Capacitor) {
        // Fetch products from RevenueCat
        const offerings = await Purchases.getOfferings();
        const currentOffering = offerings.current;
        
        if (!currentOffering || currentOffering.availablePackages.length === 0) {
            alert("Payments are not configured in Google Play Console yet.");
            setIsToppingUp(false);
            return;
        }

        // We assume product identifiers like 'wallet_topup_500' or just pick the first available for testing
        const packageIdentifier = `wallet_topup_${amount}`;
        const pkg = currentOffering.availablePackages.find(p => p.identifier === packageIdentifier) || currentOffering.availablePackages[0];
        
        // Trigger Native Google Play Bottom Sheet
        const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
        
        // Notify backend of successful native payment
        const res = await fetch("/api/wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, rc_verified: true })
        });
        const data = await res.json();
        if (data.success) {
          setBalance(data.balance);
          alert(`Successfully added ₹${amount} to your wallet!`);
        }
      } else {
        // Not in native app
        alert("Google Play Billing is only available inside the Android App.");
      }
    } catch (e: any) {
      if (e.code === "PURCHASE_CANCELLED") {
        console.log("User cancelled the purchase");
      } else {
        console.error(e);
        alert("Payment Error: " + (e.message || "Failed to initialize Google Play. Have you configured products in RevenueCat?"));
      }
    } finally {
      setIsToppingUp(false);
    }
  };

  if (balance === null) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Astro Wallet</h3>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">₹{balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-wrap justify-end gap-2 max-w-sm">
          <Button onClick={() => handleTopUp(51)} disabled={isToppingUp} variant="outline" className="border-amber-500/30 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-3">
            <Plus className="w-3 h-3 mr-1" /> ₹51
          </Button>
          <Button onClick={() => handleTopUp(101)} disabled={isToppingUp} variant="outline" className="border-amber-500/30 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-3">
            <Plus className="w-3 h-3 mr-1" /> ₹101
          </Button>
          <Button onClick={() => handleTopUp(500)} disabled={isToppingUp} variant="outline" className="border-amber-500/30 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
            <Plus className="w-3 h-3 mr-1" /> ₹500
          </Button>
          <Button onClick={() => handleTopUp(1000)} disabled={isToppingUp} className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
            <Plus className="w-3 h-3 mr-1" /> ₹1,000
          </Button>
          <Button onClick={() => handleTopUp(5100)} disabled={isToppingUp} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-sm">
            <Plus className="w-3 h-3 mr-1" /> ₹5,100
          </Button>
          <Button onClick={() => handleTopUp(11000)} disabled={isToppingUp} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold shadow-sm">
            <Plus className="w-3 h-3 mr-1" /> ₹11,000
          </Button>
          <Button onClick={() => handleTopUp(21000)} disabled={isToppingUp} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-sm">
            <Plus className="w-3 h-3 mr-1" /> ₹21,000
          </Button>
          <Button onClick={() => handleTopUp(51000)} disabled={isToppingUp} className="bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold shadow-md shadow-fuchsia-500/20 w-full sm:w-auto mt-1">
            <Plus className="w-4 h-4 mr-1" /> ₹51,000 (VIP)
          </Button>
        </div>
        <span className="text-[10px] text-muted-foreground/70 font-medium">Powered by Google Play Billing / App Store</span>
      </div>
    </div>
  );
}
