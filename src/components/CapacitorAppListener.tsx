"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { useSession } from "next-auth/react";
import { Purchases, LogLevel } from "@revenuecat/purchases-capacitor";

export function CapacitorAppListener() {
  const router = useRouter();

  const { data: session, status } = useSession();

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

      // Initialize RevenueCat (Google Play Billing)
      const initRC = async () => {
        try {
          await Purchases.setLogLevel({ level: LogLevel.DEBUG });
          await Purchases.configure({ apiKey: "test_hxNSTMjekkOJSatoqfajyXsZTkl" });
          
          if (status === "authenticated" && session?.user?.id) {
            await Purchases.logIn({ appUserID: session.user.id });
          }
        } catch (e) {
          console.error("RevenueCat Init Error:", e);
        }
      };
      
      initRC();

      return () => {
        App.removeAllListeners();
      };
    }
  }, [router, status, session?.user?.id]);

  return null;
}
