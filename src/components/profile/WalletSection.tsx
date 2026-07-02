"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Plus } from "lucide-react";

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
      // In a real app, this would redirect to Google Play Billing or Razorpay Checkout.
      // For compliance, we simulate successful digital top-up here.
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
        alert(`Successfully added ₹${amount} to your wallet!`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to top up wallet.");
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
        <div className="flex gap-2">
          <Button onClick={() => handleTopUp(500)} disabled={isToppingUp} variant="outline" className="border-amber-500/30 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
            <Plus className="w-4 h-4 mr-1" /> ₹500
          </Button>
          <Button onClick={() => handleTopUp(1000)} disabled={isToppingUp} className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
            <Plus className="w-4 h-4 mr-1" /> ₹1000
          </Button>
        </div>
        <span className="text-[10px] text-muted-foreground/70 font-medium">Powered by Google Play Billing / App Store</span>
      </div>
    </div>
  );
}
