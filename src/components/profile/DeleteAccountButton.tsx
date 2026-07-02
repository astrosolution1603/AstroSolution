"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { signOut } from "next-auth/react";

export function DeleteAccountButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });
      if (res.ok) {
        // Sign out on success
        await signOut({ callbackUrl: "/" });
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred.");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="destructive" 
        className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete Account
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-red-500/20 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Delete Account?</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Are you sure you want to permanently delete your account? This action is irreversible and will erase all your data, chats, and active wallet balance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setIsOpen(false)} 
                variant="outline"
                className="flex-1 rounded-xl py-6 bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDelete} 
                className="flex-1 rounded-xl py-6 bg-red-500 hover:bg-red-600 text-white font-bold"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete It"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
