"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";

export function CapacitorAppListener() {
  const router = useRouter();

  useEffect(() => {
    // Check if we are running in a Capacitor environment
    if (typeof window !== "undefined" && (window as any).Capacitor) {
      App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });

      return () => {
        App.removeAllListeners();
      };
    }
  }, [router]);

  return null;
}
