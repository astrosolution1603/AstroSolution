"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm({ expectedRole = "USER" }: { expectedRole?: "USER" | "ASTROLOGER" }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (!phone) {
      setError("Please enter your mobile number first.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, isLogin: true })
      });
      const data = await res.json();
      
      if (res.ok) {
        setOtpSent(true);
        alert(data.message || "OTP Sent!");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (e) {
      setError("An error occurred while sending OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        phone,
        otp,
        expectedRole,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid mobile number or OTP");
        setIsLoading(false);
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role;

      if (role === "ADMIN") {
        router.push("/masterpanel");
      } else if (role === "ASTROLOGER") {
        router.push("/astrologer");
      } else {
        router.push("/chat");
      }
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/chat" });
  };

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50">
      <h2 className="text-[28px] font-bold text-slate-900 mb-6">
        {expectedRole === "ASTROLOGER" ? "Astrologer Sign In" : "Sign In"}
      </h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[13px] font-semibold text-slate-500 mb-2">Mobile Number</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required
            disabled={otpSent}
            className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 h-14 font-medium outline-none transition-all disabled:opacity-60" 
            placeholder="9876543210"
          />
        </div>
        
        {otpSent && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-[13px] font-semibold text-slate-500 mb-2">Enter OTP</label>
            <input 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required
              className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 h-14 font-bold tracking-[0.2em] outline-none transition-all text-lg" 
              placeholder="1234"
              maxLength={4}
            />
          </div>
        )}

        {!otpSent ? (
          <button 
            type="button" 
            onClick={handleSendOtp}
            disabled={isLoading || !phone} 
            className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-[20px] h-14 mt-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-60"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <button 
            type="submit" 
            disabled={isLoading || !otp} 
            className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-[20px] h-14 mt-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        )}
      </form>

      <div className="mt-8 flex items-center">
        <div className="flex-grow border-t border-slate-100"></div>
        <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
        <div className="flex-grow border-t border-slate-100"></div>
      </div>

      <button 
        type="button" 
        onClick={handleGoogleSignIn}
        className="w-full mt-6 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 rounded-[20px] h-14 flex items-center justify-center active:scale-95 transition-all"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
          <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z" />
          <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.36 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.15 6.16-4.15z" />
        </svg>
        Sign in with Google
      </button>

      <div className="mt-8 text-center text-[14px] text-slate-500 font-medium">
        Don't have an account?{" "}
        <a href={expectedRole === "ASTROLOGER" ? "/astrologer-register" : "/register"} className="text-[#f59e0b] hover:text-[#d97706] font-bold">
          {expectedRole === "ASTROLOGER" ? "Sign Up as Astrologer" : "Create Account"}
        </a>
      </div>
    </div>
  );
}
