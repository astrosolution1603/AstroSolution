"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })} 
      className={className || "block w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"}
    >
      🚪 Log Out
    </button>
  );
}
