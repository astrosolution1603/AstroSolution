"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { X, CheckCircle2, Loader2, ShieldCheck, QrCode } from "lucide-react";
import { useSession } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";

export const CheckoutModal = ({ onClose }: { onClose: () => void }) => {
  const { cart, cartTotal, clearCart, setIsCartOpen } = useCart();
  const { data: session } = useSession();
  const [step, setStep] = useState<"details" | "payment" | "processing" | "success">("details");
  const [addressData, setAddressData] = useState({
    fullName: "",
    street: "",
    city: "",
    pincode: "",
    state: ""
  });
  
  const [settings, setSettings] = useState<any>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/masterpanel/payments")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleProceedToPayment = () => {
    if (!addressData.fullName || !addressData.street || !addressData.city || !addressData.pincode || !addressData.state) {
      return alert("Please fill in all shipping details.");
    }
    
    if (settings?.activeMethod === "MANUAL_UPI_QR") {
      setStep("payment");
    } else {
      // Direct checkout for simulated or automated methods
      executeCheckout();
    }
  };

  const executeCheckout = async () => {
    if (settings?.activeMethod === "MANUAL_UPI_QR" && !utrNumber) {
      return alert("Please enter the UTR/Reference number from your payment app.");
    }

    setStep("processing");
    const fullAddress = `${addressData.fullName}, ${addressData.street}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`;

    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalAmount: cartTotal,
          shippingAddress: fullAddress,
          utrNumber: utrNumber
        })
      });

      if (!res.ok) throw new Error("Failed to process order");

      setTimeout(() => {
        setStep("success");
        clearCart();
      }, 1500);
    } catch (e) {
      console.error(e);
      alert("Payment failed. Please try again.");
      setStep(settings?.activeMethod === "MANUAL_UPI_QR" ? "payment" : "details");
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-foreground/10 shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
        {step !== "processing" && (
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-foreground/10 transition z-10">
            <X className="w-5 h-5" />
          </button>
        )}

        {step === "details" && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-green-400" />
              Secure Checkout
            </h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={session?.user?.phone || ""} 
                  disabled 
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground/50 cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground/90 mb-3 text-sm uppercase tracking-wider">Shipping Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={addressData.fullName}
                      onChange={(e) => setAddressData({...addressData, fullName: e.target.value})}
                      placeholder="Enter recipient's full name"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1">Street Address</label>
                    <input 
                      type="text" 
                      value={addressData.street}
                      onChange={(e) => setAddressData({...addressData, street: e.target.value})}
                      placeholder="House/Flat No., Street Name, Area"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">City</label>
                    <input 
                      type="text" 
                      value={addressData.city}
                      onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">PIN Code</label>
                    <input 
                      type="text" 
                      value={addressData.pincode}
                      onChange={(e) => setAddressData({...addressData, pincode: e.target.value})}
                      placeholder="e.g. 400001"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1">State</label>
                    <input 
                      type="text" 
                      value={addressData.state}
                      onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                      placeholder="e.g. Maharashtra"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-foreground/10 pt-6 mb-6 flex justify-between items-center text-xl font-bold">
              <span>Total to Pay:</span>
              <span className="text-primary">₹{cartTotal.toLocaleString()}</span>
            </div>

            <button 
              onClick={handleProceedToPayment}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {step === "payment" && settings?.activeMethod === "MANUAL_UPI_QR" && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <QrCode className="w-6 h-6 text-primary" />
              Pay via UPI
            </h2>
            <p className="text-muted-foreground text-sm mb-6">Scan the QR code below using any UPI app (GPay, PhonePe, Paytm).</p>
            
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center mb-6">
              <QRCodeSVG 
                value={`upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.merchantName || "Astro Solution")}&am=${cartTotal}&cu=INR`}
                size={200}
                level="H"
                includeMargin={true}
              />
              <p className="text-black font-bold mt-4 text-center">{settings.upiId}</p>
              <p className="text-gray-500 text-sm text-center">Amount: ₹{cartTotal}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-foreground/90 mb-2 font-bold">Enter UTR / Reference Number</label>
                <input 
                  type="text" 
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 312345678901"
                  className="w-full bg-foreground/5 border border-foreground/20 rounded-lg p-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono tracking-wider"
                />
                <p className="text-xs text-muted-foreground mt-2">After successful payment, enter the 12-digit UTR number here to confirm your order.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep("details")} className="flex-1 py-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold transition-all border border-foreground/10">
                Back
              </button>
              <button 
                onClick={executeCheckout}
                className="flex-[2] py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
            <p className="text-muted-foreground">Please do not close this window...</p>
          </div>
        )}

        {step === "success" && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Order Received!</h2>
            {settings?.activeMethod === "MANUAL_UPI_QR" ? (
              <p className="text-muted-foreground mb-8">Your order is pending verification. We will process it as soon as the payment is confirmed.</p>
            ) : (
              <p className="text-muted-foreground mb-8">Your order has been placed. You will receive tracking details shortly.</p>
            )}
            <button 
              onClick={() => {
                onClose();
                setIsCartOpen(false);
              }}
              className="px-8 py-3 rounded-xl bg-foreground/10 hover:bg-foreground/20 transition-all font-bold"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
