"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    otp: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!formData.name || !formData.phone) {
      setError("Please fill all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, isRegistering: true })
      });
      const data = await res.json();
      
      if (res.ok) {
        setOtpSent(true);
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

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!otpSent) {
        handleSendOtp();
        return;
      }
      if (!formData.otp || formData.otp.length !== 4) {
        setError("Please enter a valid 4-digit OTP.");
        return;
      }
    } else if (step === 2) {
      if (!formData.dateOfBirth || !formData.placeOfBirth) {
        setError("Please fill all required birth details.");
        return;
      }
    }
    setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handlePrev = () => {
    setError("");
    setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      setError("Please accept the terms to continue.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create user with all profile details
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        setError(errorData.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Sign in automatically
      const res = await signIn("credentials", {
        phone: formData.phone,
        otp: formData.otp,
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
        <span className="text-[#f59e0b] font-bold text-sm">Step {step} of 3</span>
        <span className="text-[#f59e0b] font-bold text-sm">
          {step === 1 ? "Account" : step === 2 ? "Birth Details" : "Preferences"}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2.5 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-[#f59e0b] h-full rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={step === 3 ? handleRegister : (e) => { e.preventDefault(); handleNext(); }} className="space-y-5 relative z-10">
        
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-[13px] font-semibold text-slate-500 mb-2">Full Name *</label>
              <input 
                name="name"
                type="text" 
                value={formData.name} 
                onChange={handleChange} 
                required
                className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 h-14 font-medium outline-none transition-all disabled:opacity-60" 
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-semibold text-slate-500 mb-2">Mobile Number *</label>
              <input 
                name="phone"
                type="tel" 
                value={formData.phone} 
                onChange={handleChange} 
                required
                disabled={otpSent}
                className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 h-14 font-medium outline-none transition-all disabled:opacity-60" 
                placeholder="9876543210"
              />
            </div>

            {otpSent && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-[13px] font-semibold text-slate-500 mb-2">Enter OTP *</label>
                <input 
                  name="otp"
                  type="text" 
                  value={formData.otp} 
                  onChange={handleChange} 
                  required
                  className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 h-14 font-bold tracking-[0.2em] outline-none transition-all text-lg" 
                  placeholder="4-digit OTP"
                  maxLength={4}
                />
              </div>
            )}

            {!otpSent ? (
              <button 
                type="button" 
                onClick={handleSendOtp}
                disabled={isLoading || !formData.name || !formData.phone} 
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-[20px] h-14 mt-4 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-60"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleNext}
                disabled={!formData.otp}
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-[20px] h-14 mt-4 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-60"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-[13px] font-semibold text-slate-500 mb-2">Date of Birth *</label>
              <input 
                name="dateOfBirth"
                type="date" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
                required
                className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 h-14 font-medium outline-none transition-all" 
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-slate-500 mb-2">Time of Birth</label>
              <input 
                name="timeOfBirth"
                type="time" 
                value={formData.timeOfBirth} 
                onChange={handleChange} 
                className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 h-14 font-medium outline-none transition-all" 
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-slate-500 mb-2">Place of Birth *</label>
              <input 
                name="placeOfBirth"
                type="text" 
                value={formData.placeOfBirth} 
                onChange={handleChange} 
                required
                className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 h-14 font-medium outline-none transition-all" 
                placeholder="City, Country"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                type="button" 
                onClick={handlePrev} 
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-[20px] h-14 active:scale-95 transition-all"
              >
                Back
              </button>
              <button 
                type="button" 
                onClick={handleNext} 
                className="w-2/3 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-[20px] h-14 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-slate-500 mb-2">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 rounded-[16px] py-4 px-5 h-14 font-medium outline-none transition-all appearance-none"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-slate-500 mb-2">Marital Status</label>
                <select 
                  name="maritalStatus" 
                  value={formData.maritalStatus} 
                  onChange={handleChange}
                  className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 rounded-[16px] py-4 px-5 h-14 font-medium outline-none transition-all appearance-none"
                >
                  <option value="">Select...</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-slate-500 mb-2">Preferred Language</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="languagePreference" 
                    value="english" 
                    checked={formData.languagePreference === "english"}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="p-3 text-center border-2 border-slate-100 bg-slate-50 rounded-xl transition-all peer-checked:bg-amber-500/10 peer-checked:border-amber-500 peer-checked:text-amber-600 text-slate-500 font-semibold group-hover:bg-slate-100">
                    English
                  </div>
                </label>
                <label className="flex-1 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="languagePreference" 
                    value="hindi" 
                    checked={formData.languagePreference === "hindi"}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="p-3 text-center border-2 border-slate-100 bg-slate-50 rounded-xl transition-all peer-checked:bg-amber-500/10 peer-checked:border-amber-500 peer-checked:text-amber-600 text-slate-500 font-semibold group-hover:bg-slate-100">
                    हिंदी
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-slate-500 mb-2">Primary Focus for Consultation</label>
              <textarea 
                name="reasonForJoining" 
                value={formData.reasonForJoining} 
                onChange={handleChange}
                className="w-full bg-slate-100/50 border border-transparent focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-400 rounded-[16px] py-4 px-5 min-h-[100px] font-medium outline-none transition-all resize-y" 
                placeholder="I am seeking guidance for my career and personal growth..."
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group mt-6">
              <div className="mt-1">
                <input 
                  type="checkbox" 
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500 transition-all cursor-pointer"
                />
              </div>
              <span className="text-sm text-slate-500 group-hover:text-slate-700 leading-tight transition-colors">
                I agree to the <a href="/terms" target="_blank" className="text-amber-500 hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-amber-500 hover:underline">Privacy Policy</a>.
              </span>
            </label>

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={handlePrev} 
                disabled={isLoading}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-[20px] h-14 active:scale-95 transition-all disabled:opacity-60"
              >
                Back
              </button>
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-2/3 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-[20px] h-14 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-60"
              >
                {isLoading ? "Creating Account..." : "Complete"}
              </button>
            </div>
          </div>
        )}
      </form>
      
      <div className="mt-8 text-center text-[14px] text-slate-500 font-medium">
        Already have an account?{" "}
        <a href="/login" className="text-[#f59e0b] hover:text-[#d97706] font-bold">
          Sign In
        </a>
      </div>
    </div>
  );
}
