"use client";

import { useState, useEffect } from "react";
import { CreditCard, Save, QrCode, ShieldAlert } from "lucide-react";

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState({
    activeMethod: "SIMULATED",
    upiId: "",
    merchantName: "",
    razorpayKey: "",
    razorpaySecret: "",
    razorpayMode: "TEST",
    paytmMerchantId: "",
    paytmMerchantKey: "",
    paytmMode: "TEST",
    revenueCatApiKey: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/masterpanel/payments")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSettings({
            activeMethod: data.activeMethod || "SIMULATED",
            upiId: data.upiId || "",
            merchantName: data.merchantName || "",
            razorpayKey: data.razorpayKey || "",
            razorpaySecret: data.razorpaySecret || "",
            razorpayMode: data.razorpayMode || "TEST",
            paytmMerchantId: data.paytmMerchantId || "",
            paytmMerchantKey: data.paytmMerchantKey || "",
            paytmMode: data.paytmMode || "TEST",
            revenueCatApiKey: data.revenueCatApiKey || ""
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/masterpanel/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert("Payment settings saved successfully!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CreditCard className="text-primary w-8 h-8" />
            Unified Payment Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure global payment methods for checkout flows.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-white/5 p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Active Payment Method</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { id: "SIMULATED", name: "Simulated", icon: ShieldAlert, desc: "Testing mode. No real money." },
            { id: "MANUAL_UPI_QR", name: "Manual UPI QR", icon: QrCode, desc: "Show QR Code, verify UTR." },
            { id: "RAZORPAY", name: "Razorpay", icon: CreditCard, desc: "Physical goods via Razorpay." },
            { id: "PAYTM", name: "Paytm", icon: CreditCard, desc: "Physical goods via Paytm." },
          ].map(method => (
            <div 
              key={method.id}
              onClick={() => setSettings({ ...settings, activeMethod: method.id })}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 ${
                settings.activeMethod === method.id 
                  ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.2)]" 
                  : "border-white/10 hover:border-white/20 bg-black/20"
              }`}
            >
              <method.icon className={`w-8 h-8 ${settings.activeMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
              <h3 className="font-bold">{method.name}</h3>
              <p className="text-xs text-muted-foreground">{method.desc}</p>
            </div>
          ))}
        </div>

        {settings.activeMethod === "MANUAL_UPI_QR" && (
          <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <QrCode className="text-primary w-5 h-5" /> 
              UPI Configuration
            </h3>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Merchant UPI ID</label>
              <input 
                type="text" 
                value={settings.upiId}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                placeholder="e.g. 9999999999@paytm or merchant@ybl"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Merchant Name</label>
              <input 
                type="text" 
                value={settings.merchantName}
                onChange={(e) => setSettings({ ...settings, merchantName: e.target.value })}
                placeholder="e.g. Astro Solution"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
              />
            </div>
          </div>
        )}

        {settings.activeMethod === "RAZORPAY" && (
          <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CreditCard className="text-primary w-5 h-5" /> 
                Razorpay API Keys
              </h3>
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
                <button 
                  onClick={() => setSettings({ ...settings, razorpayMode: "TEST" })}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${settings.razorpayMode === "TEST" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"}`}
                >TEST</button>
                <button 
                  onClick={() => setSettings({ ...settings, razorpayMode: "LIVE" })}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${settings.razorpayMode === "LIVE" ? "bg-red-500 text-white" : "text-muted-foreground hover:text-white"}`}
                >LIVE</button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Key ID</label>
              <input 
                type="text" 
                value={settings.razorpayKey}
                onChange={(e) => setSettings({ ...settings, razorpayKey: e.target.value })}
                placeholder="rzp_test_..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Key Secret</label>
              <input 
                type="password" 
                value={settings.razorpaySecret}
                onChange={(e) => setSettings({ ...settings, razorpaySecret: e.target.value })}
                placeholder="Secret key"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
              />
            </div>
          </div>
        )}

        {settings.activeMethod === "PAYTM" && (
          <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CreditCard className="text-primary w-5 h-5" /> 
                Paytm Business API Keys
              </h3>
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
                <button 
                  onClick={() => setSettings({ ...settings, paytmMode: "TEST" })}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${settings.paytmMode === "TEST" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"}`}
                >TEST</button>
                <button 
                  onClick={() => setSettings({ ...settings, paytmMode: "LIVE" })}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${settings.paytmMode === "LIVE" ? "bg-red-500 text-white" : "text-muted-foreground hover:text-white"}`}
                >LIVE</button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Merchant ID (MID)</label>
              <input 
                type="text" 
                value={settings.paytmMerchantId}
                onChange={(e) => setSettings({ ...settings, paytmMerchantId: e.target.value })}
                placeholder="Paytm MID"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Merchant Key</label>
              <input 
                type="password" 
                value={settings.paytmMerchantKey}
                onChange={(e) => setSettings({ ...settings, paytmMerchantKey: e.target.value })}
                placeholder="Secret key"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
              />
            </div>
          </div>
        )}

        <div className="mt-8 bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <CreditCard className="text-primary w-5 h-5" /> 
            Google Play Billing (Digital Goods)
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Required by Google for Wallet Top-ups and Chat/Pooja digital goods.</p>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">RevenueCat API Key</label>
            <input 
              type="text" 
              value={settings.revenueCatApiKey}
              onChange={(e) => setSettings({ ...settings, revenueCatApiKey: e.target.value })}
              placeholder="goog_..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
