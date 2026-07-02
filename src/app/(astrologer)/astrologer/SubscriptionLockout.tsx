"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CalendarX2 } from "lucide-react";

interface Props {
  name: string;
  expiry?: string;
  phone: string;
}

export default function SubscriptionLockout({ name, expiry, phone }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRenew = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/astrologer/subscription", {
        method: "POST"
      });
      if (res.ok) {
        router.refresh(); // This will reload the page and unlock the chat
      } else {
        setError("Failed to process payment. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during renewal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-transparent items-center justify-center p-4">
      <div className="max-w-md w-full bg-card/50 backdrop-blur-md border border-foreground/10 rounded-3xl p-8 text-center shadow-xl">
        
        <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CalendarX2 className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Subscription Expired</h1>
        <p className="text-muted-foreground mb-6">
          Hi {name}, your astrologer subscription has expired or is inactive. You need an active subscription to access the chat portal.
        </p>

        {expiry && (
          <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3 rounded-xl mb-6">
            <AlertCircle className="w-4 h-4" />
            Expired on {new Date(expiry).toLocaleDateString()}
          </div>
        )}

        <div className="bg-foreground/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 mb-6">
          <div className="text-3xl font-black text-foreground mb-1">â‚¹1,499</div>
          <p className="text-sm text-muted-foreground">Renew for 30 Days</p>
        </div>

        {error && <div className="mb-6 text-red-500 text-sm font-medium">{error}</div>}

        <button
          onClick={handleRenew}
          disabled={loading}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg rounded-xl transition-colors shadow-lg shadow-amber-500/20"
        >
          {loading ? "Processing Payment..." : "Pay â‚¹1499 to Renew"}
        </button>
      </div>
    </div>
  );
}

