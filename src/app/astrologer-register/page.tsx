"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Star, ShieldCheck, Zap, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function AstrologerRegistrationPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Auth State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("1234");
  const [authStep, setAuthStep] = useState<1 | 2>(1); // 1: Register, 2: OTP
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Application State
  const [experience, setExperience] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [languages, setLanguages] = useState("");
  
  // Flow State
  const [appState, setAppState] = useState<"LOADING" | "FORM" | "PENDING" | "APPROVED" | "REJECTED" | "PAID">("LOADING");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch application status when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchApplicationStatus();
    } else if (status === "unauthenticated") {
      setAppState("FORM"); // Show auth form
    }
  }, [status]);

  const fetchApplicationStatus = async () => {
    try {
      const res = await fetch("/api/user/profile"); // We need an API to fetch the current user's profile with application. Or we can create one quickly.
      if (res.ok) {
        const data = await res.json();
        
        if (data.user?.role === "ASTROLOGER") {
          router.push("/astrologer");
          return;
        }

        const app = data.user?.application;
        if (!app) {
          setAppState("FORM");
        } else if (app.status === "PENDING") {
          setAppState("PENDING");
        } else if (app.status === "REJECTED") {
          setAppState("REJECTED");
        } else if (app.status === "APPROVED" && app.paymentStatus === "UNPAID") {
          setAppState("APPROVED");
        } else if (app.paymentStatus === "PAID") {
          setAppState("PAID");
          router.push("/astrologer");
        }
      } else {
        setAppState("FORM");
      }
    } catch (e) {
      console.error(e);
      setAppState("FORM");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError("You must accept the Terms of Service to apply.");
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, isRegistering: true }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setAuthStep(2);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        phone,
        otp,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid OTP");
      } else {
        // Now that they are signed in, if they are a NEW user, we should update their name
        // (because send-otp doesn't save the name, and the normal register route wasn't called)
        try {
          await fetch("/api/user/update-name", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
          });
        } catch(e) {
          console.error("Failed to update name", e);
        }
        // Session will change, useEffect will trigger fetchApplicationStatus
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/astrologer/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienceYears: experience, specialties, languages }),
      });
      
      if (res.ok) {
        setAppState("PENDING");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit application");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/astrologer/pay", {
        method: "POST"
      });
      
      if (res.ok) {
        router.push("/astrologer");
      } else {
        const data = await res.json();
        setError(data.error || "Payment failed");
      }
    } catch (err) {
      setError("An error occurred during payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-none">
        
        {/* Left Side: Pitch */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-amber-500/10 to-orange-500/10 h-full flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Join Astro Solution as a Professional Astrologer
          </h1>
          <p className="text-slate-600 dark:text-white/70 mb-8 text-lg">
            Connect with millions of users worldwide and guide them through their cosmic journey.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Rigorous Vetting</h3>
                <p className="text-slate-600 dark:text-white/60">We maintain high standards. Every application is reviewed by our master astrologers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Instant Client Access</h3>
                <p className="text-slate-600 dark:text-white/60">Once approved and boarded, connect to users instantly through our AI portal.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Secure Platform</h3>
                <p className="text-slate-600 dark:text-white/60">100% secure payments and private chat sessions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Form */}
        <div className="p-8 md:p-12">
          {appState === "LOADING" ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading application status...</p>
            </div>
          ) : status === "unauthenticated" ? (
            /* AUTHENTICATION STEP */
            authStep === 1 ? (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Astrologer Application</h2>
                <p className="text-slate-600 dark:text-white/60 mb-8">Step 1: Verify your identity to begin the application process.</p>
                {error && <div className="mb-6 p-4 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-xl text-sm">{error}</div>}
                
                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      placeholder="Pt. Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      placeholder="9991896001"
                    />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group mt-4 mb-2">
                    <div className="mt-1">
                      <input 
                        type="checkbox" 
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-amber-500 focus:ring-amber-500 transition-all"
                      />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-white/70 leading-tight">
                      I agree to the <a href="/terms" target="_blank" className="text-amber-500 hover:underline">Terms of Service (EULA)</a> and <a href="/privacy" target="_blank" className="text-amber-500 hover:underline">Privacy Policy</a>, and agree to abide by the zero-tolerance policy for objectionable behavior.
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {loading ? "Sending OTP..." : "Continue to Step 2"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verify Mobile Number</h2>
                <p className="text-slate-600 dark:text-white/60 mb-8">Enter the OTP sent to {phone} to proceed.</p>
                {error && <div className="mb-6 p-4 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-xl text-sm">{error}</div>}
                
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1">OTP (Hint: 1234)</label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-center tracking-widest text-lg font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify & Continue to Application"}
                  </button>
                </form>
              </>
            )
          ) : appState === "FORM" ? (
            /* APPLICATION FORM STEP */
            <>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Step 2: Professional Details</h2>
              <p className="text-slate-600 dark:text-white/60 mb-6">Tell us about your astrological expertise.</p>
              {error && <div className="mb-6 p-4 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-xl text-sm">{error}</div>}
              
              <form onSubmit={handleSubmitApplication} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1">Specialties</label>
                  <input
                    type="text"
                    required
                    value={specialties}
                    onChange={(e) => setSpecialties(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    placeholder="Vedic, Tarot, Numerology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1">Languages Spoken</label>
                  <input
                    type="text"
                    required
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    placeholder="English, Hindi"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </>
          ) : appState === "PENDING" ? (
            /* PENDING STATE */
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Application Under Review</h2>
              <p className="text-slate-600 dark:text-white/70 max-w-sm">
                Your application has been successfully submitted. Our master astrologers are currently reviewing your credentials. We will shortly contact you.
              </p>
            </div>
          ) : appState === "REJECTED" ? (
            /* REJECTED STATE */
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Application Declined</h2>
              <p className="text-slate-600 dark:text-white/70 max-w-sm">
                Unfortunately, your application did not meet our criteria at this time.
              </p>
            </div>
          ) : appState === "APPROVED" ? (
            /* APPROVED -> PAY SETUP FEE */
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Congratulations!</h2>
              <p className="text-slate-600 dark:text-white/70 max-w-sm mb-8">
                Your application has been approved. To activate your astrologer profile and start taking clients, please pay the platform onboarding fee.
              </p>
              
              <div className="w-full p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl mb-8 border border-slate-200 dark:border-white/10 flex justify-between items-center">
                <div className="text-left">
                  <p className="text-sm text-slate-500 dark:text-white/50 font-medium uppercase tracking-wider">One-time Fee</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">₹1499</p>
                </div>
                <div className="text-amber-500 font-bold">Lifetime Access</div>
              </div>

              {error && <div className="w-full mb-6 p-4 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-xl text-sm">{error}</div>}

              <div className="w-full flex flex-col items-center">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Pay ₹1499 & Activate Account"}
                </button>
                <span className="text-[10px] text-slate-400 mt-2 font-medium">Powered by Google Play Billing / App Store</span>
              </div>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
}
