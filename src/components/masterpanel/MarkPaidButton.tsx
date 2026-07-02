"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MarkPaidButton({ astrologerId, disabled }: { astrologerId: string, disabled: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarkPaid = async () => {
    if (disabled || loading) return;
    
    if (!confirm("Are you sure you want to mark this astrologer as paid? This will reset their available balance to ₹0.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/masterpanel/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ astrologerId })
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to process payout.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleMarkPaid}
      disabled={disabled || loading}
      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
        disabled || loading 
          ? "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed" 
          : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
      }`}
    >
      {loading ? "Processing..." : "Mark Paid"}
    </button>
  );
}
