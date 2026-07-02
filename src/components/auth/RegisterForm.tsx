"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    gender: "",
    maritalStatus: "",
    occupation: "",
    languagePreference: "english",
    reasonForJoining: "",
    acceptTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSendOtp = async () => {
    if (!formData.name || !formData.phone) {
      return setError("Please fill all required fields first");
    }
    if (formData.phone.length < 10) {
      return setError("Please enter a valid mobile number");
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone })
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

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!otpSent) {
        return handleSendOtp();
      }
      if (!otp || otp.length !== 4) {
        return setError("Please enter the 4-digit OTP sent to your phone");
      }
      // OTP is theoretically verified in the final step by NextAuth, but we proceed for now
    }
    if (step === 2) {
      if (!formData.dateOfBirth || !formData.placeOfBirth) {
        return setError("Date of Birth and Place of Birth are required");
      }
    }
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.acceptTerms) {
      return setError("Please accept the terms to continue");
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Auto sign-in
      const signInRes = await signIn("credentials", {
        phone: formData.phone,
        otp: otp,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error("Failed to sign in after registration");
      }

      router.push("/chat");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background/40 backdrop-blur-3xl border border-foreground/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative cosmic blur inside the card */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-[50px] rounded-full pointer-events-none"></div>
      
      <div className="mb-8 relative z-10">
        <div className="flex justify-between text-xs text-amber-400 font-medium mb-2">
          <span>Step {step} of 3</span>
          <span>{step === 1 ? "Account" : step === 2 ? "Birth Details" : "Preferences"}</span>
        </div>
        <div className="w-full bg-foreground/20 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-[16px] text-sm mb-6 relative z-10 font-medium">
          {error}
        </div>
      )}



      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Full Name *</label>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground/50 rounded-[16px] py-6 h-14 shadow-inner" 
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Mobile Number *</label>
              <Input 
                name="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={handleChange} 
                disabled={otpSent}
                className="bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground/50 rounded-[16px] py-6 h-14 shadow-inner disabled:opacity-50" 
                placeholder="9876543210"
              />
            </div>
            
            {otpSent && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Enter OTP *</label>
                <Input 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  required
                  className="bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground/50 rounded-[16px] py-6 h-14 shadow-inner" 
                  placeholder="4-digit OTP"
                  maxLength={4}
                />
              </div>
            )}

            {!otpSent ? (
              <Button type="button" onClick={handleNext} disabled={isLoading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-[20px] h-14 mt-4 shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-[20px] h-14 mt-4 shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                Verify & Continue
              </Button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
            <p className="text-sm text-muted-foreground mb-2 font-medium">Required for personalized readings</p>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Date of Birth *</label>
              <Input 
                name="dateOfBirth" 
                type="date" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
                className="bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground/50 rounded-[16px] py-6 h-14 shadow-inner" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Time of Birth</label>
              <Input 
                name="timeOfBirth" 
                type="time" 
                value={formData.timeOfBirth} 
                onChange={handleChange} 
                className="bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground/50 rounded-[16px] py-6 h-14 shadow-inner" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Place of Birth *</label>
              <Input 
                name="placeOfBirth" 
                value={formData.placeOfBirth} 
                onChange={handleChange} 
                className="bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground/50 rounded-[16px] py-6 h-14 shadow-inner" 
                placeholder="City, Country"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-full h-14 rounded-[16px] border border-foreground/10 bg-foreground/5 px-4 text-sm text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="" className="bg-background">Select...</option>
                  <option value="Male" className="bg-background">Male</option>
                  <option value="Female" className="bg-background">Female</option>
                  <option value="Other" className="bg-background">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Marital Status</label>
                <select 
                  name="maritalStatus" 
                  value={formData.maritalStatus} 
                  onChange={handleChange}
                  className="w-full h-14 rounded-[16px] border border-foreground/10 bg-foreground/5 px-4 text-sm text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="" className="bg-background">Select...</option>
                  <option value="Single" className="bg-background">Single</option>
                  <option value="Married" className="bg-background">Married</option>
                  <option value="Divorced" className="bg-background">Divorced</option>
                  <option value="Widowed" className="bg-background">Widowed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Occupation</label>
              <Input 
                name="occupation" 
                value={formData.occupation} 
                onChange={handleChange} 
                className="bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground/50 rounded-[16px] py-6 h-14 shadow-inner" 
                placeholder="Software Engineer"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" onClick={handlePrev} variant="outline" className="w-1/3 bg-foreground/5 border-foreground/10 text-foreground hover:bg-foreground/10 rounded-[20px] h-14 backdrop-blur-md active:scale-95 transition-all">
                Back
              </Button>
              <Button type="button" onClick={handleNext} className="w-2/3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-[20px] h-14 shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-3">Preferred Language</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input 
                    type="radio" 
                    name="languagePreference" 
                    value="english" 
                    checked={formData.languagePreference === "english"}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="p-3 text-center border rounded-lg transition-all peer-checked:bg-amber-500/20 peer-checked:border-amber-500 peer-checked:text-amber-400 border-foreground/20 text-muted-foreground hover:bg-foreground/5">
                    English
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input 
                    type="radio" 
                    name="languagePreference" 
                    value="hindi" 
                    checked={formData.languagePreference === "hindi"}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="p-3 text-center border rounded-lg transition-all peer-checked:bg-amber-500/20 peer-checked:border-amber-500 peer-checked:text-amber-400 border-foreground/20 text-muted-foreground hover:bg-foreground/5">
                    हिंदी
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-3">Primary Focus for Consultation</label>
              <textarea 
                name="reasonForJoining" 
                value={formData.reasonForJoining} 
                onChange={(e) => setFormData({...formData, reasonForJoining: e.target.value})}
                className="w-full bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-muted-foreground/50 rounded-[16px] p-4 min-h-[100px] shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-y" 
                placeholder="I am seeking guidance for my career and personal growth..."
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group mt-4">
              <div className="mt-1">
                <input 
                  type="checkbox" 
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                  className="w-5 h-5 rounded border-foreground/20 bg-foreground/5 text-amber-500 focus:ring-amber-500 transition-all"
                />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground/90 leading-tight">
                I agree to the <a href="/terms" target="_blank" className="text-amber-500 hover:underline">Terms of Service (EULA)</a> and <a href="/privacy" target="_blank" className="text-amber-500 hover:underline">Privacy Policy</a>, and I acknowledge that astrology is for guidance purposes only.
              </span>
            </label>

            <div className="flex gap-3 pt-6">
              <Button type="button" onClick={handlePrev} variant="outline" className="w-1/3 bg-foreground/5 border-foreground/10 text-foreground hover:bg-foreground/10 rounded-[20px] h-14 backdrop-blur-md active:scale-95 transition-all" disabled={isLoading}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading} className="w-2/3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-[20px] h-14 shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                {isLoading ? "Creating Profile..." : "Complete Registration"}
              </Button>
            </div>
          </div>
        )}
      </form>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="text-amber-400 hover:text-amber-300 font-medium">
          Sign In
        </a>
      </div>
    </div>
  );
}

