"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        phone,
        otp,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid mobile number or OTP");
        setIsLoading(false);
        return;
      }

      // Check role and redirect accordingly
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
    <div className="bg-background/40 backdrop-blur-3xl border border-foreground/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative cosmic blur inside the card */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-[50px] rounded-full pointer-events-none"></div>

      <h2 className="text-2xl font-black text-foreground mb-6 relative z-10">Sign In</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-[16px] text-sm mb-6 relative z-10 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2">Mobile Number</label>
          <Input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required
            className="bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground/50 rounded-[16px] py-6 h-14 shadow-inner" 
            placeholder="9876543210"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2">OTP (Test: 1234)</label>
          <Input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            required
            className="bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground/50 rounded-[16px] py-6 h-14 shadow-inner" 
            placeholder="Enter OTP"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-[20px] h-14 mt-4 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 flex items-center relative z-10">
        <div className="flex-grow border-t border-foreground/10"></div>
        <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs font-semibold uppercase tracking-widest">Or continue with</span>
        <div className="flex-grow border-t border-foreground/10"></div>
      </div>

      <Button 
        type="button" 
        onClick={handleGoogleSignIn}
        variant="outline" 
        className="w-full mt-6 bg-foreground/5 hover:bg-foreground/10 text-foreground font-semibold border-foreground/10 rounded-[20px] h-14 backdrop-blur-md active:scale-95 transition-all"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
          <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z" />
          <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.36 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.15 6.16-4.15z" />
        </svg>
        Sign in with Google
      </Button>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <a href="/register" className="text-amber-400 hover:text-amber-300 font-medium">
          Create Account
        </a>
      </div>
    </div>
  );
}

