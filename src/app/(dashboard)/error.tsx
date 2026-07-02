"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="text-4xl mb-4">🌠</div>
      <h2 className="text-2xl font-bold text-white mb-2">Cosmic Interference</h2>
      <p className="text-white/60 mb-6 max-w-md">
        We encountered a disruption in the cosmic energies. Please try again.
      </p>
      <Button 
        onClick={() => reset()}
        className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
      >
        Try Again
      </Button>
    </div>
  );
}
