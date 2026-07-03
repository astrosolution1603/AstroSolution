"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";

export function WalletMini() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/wallet")
      .then(res => res.json())
      .then(data => {
        if (data.balance !== undefined) setBalance(data.balance);
      })
      .catch(() => {});
  }, []);

  if (balance === null) return null;

  return (
    <Link href="/profile" className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full transition-colors">
      <Wallet className="w-4 h-4" />
      <span className="text-xs font-bold font-mono">₹{balance.toLocaleString()}</span>
    </Link>
  );
}
