"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown } from "lucide-react";
import { Purchases, CustomerInfo } from "@revenuecat/purchases-capacitor";
import { RevenueCatUI } from "@revenuecat/purchases-capacitor-ui";

export function ProSubscriptionSection() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (typeof window !== "undefined" && (window as any).Capacitor) {
          const customerInfo = await Purchases.getCustomerInfo();
          // Check if the user has the "AstroSolution Pro" entitlement active
          if (typeof customerInfo.entitlements.active["AstroSolution Pro"] !== "undefined") {
            setIsPro(true);
          }
        }
      } catch (e) {
        console.error("Failed to check subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();

    // Listen for purchases to update the UI in real-time
    let listener: any = null;
    if (typeof window !== "undefined" && (window as any).Capacitor) {
      Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        if (typeof customerInfo.entitlements.active["AstroSolution Pro"] !== "undefined") {
            setIsPro(true);
        } else {
            setIsPro(false);
        }
      }).then(l => listener = l);
    }

    return () => {
        if (listener) {
          listener.remove();
        }
    };
  }, []);

  const handleUpgrade = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).Capacitor) {
        // Present the RevenueCat Paywall automatically configured in your dashboard
        const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
          requiredEntitlementIdentifier: "AstroSolution Pro",
        });

        console.log("Paywall Result:", paywallResult);
      } else {
        alert("Subscriptions are only available in the Android and iOS apps.");
      }
    } catch (e: any) {
      console.error("Error presenting paywall:", e);
    }
  };

  const handleManageSubscription = async () => {
    try {
        if (typeof window !== "undefined" && (window as any).Capacitor) {
            // Customer Center for managing subscriptions, refunds, and support
            await RevenueCatUI.presentCustomerCenter();
        }
    } catch (e) {
        console.error("Error presenting Customer Center:", e);
    }
  }

  if (loading) return null;

  return (
    <div className={`border rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 ${isPro ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/10 border-purple-500/30' : 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPro ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-700 text-amber-400'}`}>
          {isPro ? <Crown className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isPro ? 'text-purple-600 dark:text-purple-400' : 'text-white'}`}>
            AstroSolution Pro
          </h3>
          <p className={isPro ? 'text-sm text-purple-600/80 dark:text-purple-400/80 font-medium' : 'text-sm text-slate-400'}>
            {isPro ? "You are a Premium Member!" : "Unlock unlimited horoscopes and premium features."}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        {isPro ? (
          <Button onClick={handleManageSubscription} variant="outline" className="border-purple-500/50 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
            Manage Subscription
          </Button>
        ) : (
          <Button onClick={handleUpgrade} className="bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <Crown className="w-4 h-4 mr-2" /> Upgrade Now
          </Button>
        )}
      </div>
    </div>
  );
}
