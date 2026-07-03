"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      setError("Please fill all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, isRegistering: true })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
        alert(data.message || "OTP Sent!");
      } else {
        setError(data.error || "Failed to register");
      }
    } catch (e) {
      setError("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    setError("");

    try {
      // Create user first
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, otp })
      });
      
      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        setError(errorData.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Then sign in automatically
      const res = await signIn("credentials", {
        phone,
        otp,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid OTP or login failed");
        setIsLoading(false);
        return;
      }

      router.push("/chat");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50">
      
      {/* Progress Header */}
      <div className="flex justify-between items-end mb-3">
        <span className="text-[#f59e0b] font-bold text-sm">Step {step} of 2</span>
        <span className="text-[#f59e0b] font-bold text-sm">Account</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2.5 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-[#f59e0b] h-full rounded-full transition-all duration-500 ease-out" 
          style={{ width: step === 1 ? '50%' : '100%' }}
        ></div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium border border-red-100">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-[13px] font-semibold text-slate-500 mb-2">Full Name *</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 h-14 font-medium outline-none transition-all" 
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-[13px] font-semibold text-slate-500 mb-2">Mobile Number *</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required
              className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 h-14 font-medium outline-none transition-all" 
              placeholder="9876543210"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !name || !phone} 
            className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-[20px] h-14 mt-4 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-60"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <label className="block text-[13px] font-semibold text-slate-500 mb-2">Verify Mobile Number *</label>
            <input 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required
              className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 h-14 font-bold tracking-[0.2em] outline-none transition-all text-lg" 
              placeholder="4-digit OTP"
              maxLength={4}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading || !otp} 
            className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-[20px] h-14 mt-4 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-60"
          >
            {isLoading ? "Verifying..." : "Verify & Create Account"}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-slate-500 hover:text-slate-700 text-sm font-semibold mt-2"
          >
            Go Back
          </button>
        </form>
      )}

      <div className="mt-8 text-center text-[14px] text-slate-500 font-medium">
        Already have an account?{" "}
        <a href="/login" className="text-[#f59e0b] hover:text-[#d97706] font-bold">
          Sign In
        </a>
      </div>
    </div>
  );
}
