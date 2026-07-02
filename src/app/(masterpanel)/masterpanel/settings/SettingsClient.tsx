"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsClient({ 
  initialFast2smsKey, 
  initialOtpTemplate,
  initialInAppNotificationsEnabled
}: { 
  initialFast2smsKey: string;
  initialOtpTemplate: string;
  initialInAppNotificationsEnabled: boolean;
}) {
  const [fast2smsKey, setFast2smsKey] = useState(initialFast2smsKey);
  const [otpTemplate, setOtpTemplate] = useState(initialOtpTemplate);
  const [inAppNotificationsEnabled, setInAppNotificationsEnabled] = useState(initialInAppNotificationsEnabled);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/masterpanel/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fast2smsKey, 
          otpMessageTemplate: otpTemplate,
          inAppNotificationsEnabled 
        })
      });
      if (res.ok) {
        alert("Settings saved successfully!");
        router.refresh();
      } else {
        alert("Failed to save settings.");
      }
    } catch (e) {
      alert("Error saving settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Platform Settings</h1>

      <div className="bg-card p-6 rounded-2xl shadow-sm border mb-8 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">SMS & OTP Configuration (Fast2SMS)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Fast2SMS API Key</label>
            <Input 
              type="password"
              value={fast2smsKey}
              onChange={(e) => setFast2smsKey(e.target.value)}
              placeholder="Enter your API Key"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">Get this from your Fast2SMS dev dashboard.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">OTP Message Template</label>
            <Input 
              value={otpTemplate}
              onChange={(e) => setOtpTemplate(e.target.value)}
              placeholder="Your Astro Solution OTP is {#OTP#}. Do not share this."
            />
            <p className="text-xs text-muted-foreground mt-1">Use <code>{`{#OTP#}`}</code> where you want the 4-digit code to appear.</p>
          </div>

          <Button onClick={handleSave} disabled={loading} className="mt-4">
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>

      <div className="bg-card p-6 rounded-2xl shadow-sm border mb-8 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="inAppNotificationsEnabled"
              checked={inAppNotificationsEnabled}
              onChange={(e) => setInAppNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
            <label htmlFor="inAppNotificationsEnabled" className="text-sm font-semibold cursor-pointer">
              Enable In-App Notifications (Bell Icon)
            </label>
          </div>
          <p className="text-xs text-muted-foreground ml-8">When enabled, users and astrologers will receive in-app alerts for new messages.</p>
          
          <Button onClick={handleSave} disabled={loading} className="mt-4 ml-8">
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>
    </div>
  );
}
