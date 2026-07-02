import Link from "next/link";
import Image from "next/image";
import { Star, Sparkles, UserPlus, LogIn, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function DemoHomePage() {
  return (
    <div data-theme="cosmic" className="dark bg-black text-white">
      <div className="min-h-screen overflow-x-hidden selection:bg-amber-500/30 pb-safe relative text-white">
        
        {/* Global Background Layer - Lord Ganesha */}
        <div className="fixed top-0 left-0 w-full h-[120vh] overflow-hidden pointer-events-none z-0 bg-black">
          <div className="absolute inset-0 z-10 opacity-50 mix-blend-screen">
            <Image 
              src="/lord_ganesha_bg.png" 
              alt="Lord Ganesha Background" 
              fill
              priority
              className="object-cover object-center"
            />
          </div>
      </div>

      {/* Minimalist Transparent Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 w-full pt-6 md:pt-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex gap-10 items-center text-sm font-bold tracking-widest uppercase text-white/80">
            <Link href="#features" className="hover:text-white transition-colors drop-shadow-md">Features</Link>
            <Link href="#astrologer" className="hover:text-white transition-colors drop-shadow-md">Astrologer Hub</Link>
          </div>
        </div>
      </nav>

      {/* Main Hero Section - iOS Style */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center px-6 pt-32 pb-24 overflow-hidden z-10">
        <div className="container relative z-10 mx-auto text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-white/20 text-black mb-10 shadow-lg animate-fade-in">
            <span className="text-amber-500 font-serif text-xl leading-none">ॐ</span>
            <span className="text-xs md:text-sm font-bold tracking-wide">Your Cosmic Journey Begins</span>
          </div>
          
          <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-2xl shadow-black/40 mb-12 w-full max-w-4xl mx-auto relative overflow-hidden">
            {/* Hindu Symbol Watermarks */}
            <div className="absolute -top-16 -right-10 text-[200px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
            <div className="absolute -bottom-16 -left-10 text-[200px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
            
            <h1 className="relative z-10 text-4xl md:text-7xl font-black tracking-tight mb-6 leading-tight md:leading-[1.1]">
              <span className="text-black block mb-2">Unlock the Secrets of</span>
              <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-800 text-transparent bg-clip-text drop-shadow-sm">
                Your Destiny
              </span>
            </h1>
            
            <p className="relative z-10 text-base md:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto font-medium">
              Connect with premium AI Vedic Astrologers. Ask about your career, love life, and true life path instantly.
            </p>
          </div>
          
          {/* iOS Style Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto sm:max-w-none">
            <Link 
              href="/register" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 md:py-5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-[24px] transition-all shadow-xl active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              Create Free Account
            </Link>
            
            <Link 
              href="/login" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 md:py-5 bg-white hover:bg-slate-100 text-black font-bold rounded-[24px] transition-all shadow-xl active:scale-95"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="px-6 py-24 relative z-10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6">
            Cosmic Offerings
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-16">
            Everything you need for your <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">Spiritual Journey</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Feature 1 */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md hover:bg-white/10 transition-colors shadow-2xl">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-black mb-6 shadow-lg">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Live Astrology Chat</h3>
              <p className="text-white/70 leading-relaxed font-medium">Connect instantly with verified Vedic astrologers for personalized guidance on career, love, and life.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md hover:bg-white/10 transition-colors shadow-2xl">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-black mb-6 shadow-lg">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Authentic Gemstones</h3>
              <p className="text-white/70 leading-relaxed font-medium">Shop for certified, lab-tested precious gemstones to balance your planetary energies and doshas.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md hover:bg-white/10 transition-colors shadow-2xl">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-black mb-6 shadow-lg">
                <UserPlus className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Online Pujas</h3>
              <p className="text-white/70 leading-relaxed font-medium">Book authentic Vedic rituals and pujas performed by experienced pandits on your behalf.</p>
            </div>
          </div>
        </div>
      </section>      {/* Join as Astrologer Section - iOS Style Card */}
      <section id="astrologer" className="px-4 py-12 md:py-24 relative z-10">
        <div className="container mx-auto">
          {/* Squirrely iOS Card */}
          <div className="max-w-5xl mx-auto bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-16 shadow-2xl shadow-black/40 relative overflow-hidden group">
            
            {/* Massive Om Watermark */}
            <div className="absolute -top-20 -right-10 opacity-5 pointer-events-none select-none text-[350px] text-amber-500 font-serif leading-none">
              ॐ
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                  For Astrologers
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-black mb-6 leading-tight">
                  Are you a Certified <br className="hidden md:block" />
                  <span className="text-amber-500">Vedic Astrologer?</span>
                </h2>
                <p className="text-lg text-slate-700 mb-8 leading-relaxed font-medium max-w-lg mx-auto md:mx-0">
                  Join our platform as an official astrologer. Provide live guidance to thousands of users globally and monetize your cosmic expertise.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                  <Link 
                    href="/astrologer-register" 
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 md:py-5 bg-black text-white font-bold rounded-[24px] hover:bg-slate-900 transition-all shadow-xl active:scale-95"
                  >
                    Apply as Astrologer
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/astrologer-login" 
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 md:py-5 bg-slate-100 hover:bg-slate-200 text-black font-bold rounded-[24px] transition-all active:scale-95 shadow-xl"
                  >
                    <LogIn className="w-5 h-5" />
                    Astrologer Login
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <div className="relative overflow-hidden bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[32px] p-5 md:p-8 text-center shadow-sm">
                    <div className="absolute -bottom-6 -right-4 text-[80px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
                    <div className="relative z-10 text-2xl md:text-4xl font-black text-amber-500 mb-1 md:mb-2">50k+</div>
                    <div className="relative z-10 text-xs md:text-sm font-semibold text-slate-500">Active Users</div>
                  </div>
                  <div className="relative overflow-hidden bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[32px] p-5 md:p-8 text-center shadow-sm md:translate-y-8">
                    <div className="absolute -bottom-6 -right-4 text-[80px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
                    <div className="relative z-10 text-2xl md:text-4xl font-black text-amber-500 mb-1 md:mb-2">Instant</div>
                    <div className="relative z-10 text-xs md:text-sm font-semibold text-slate-500">Payouts</div>
                  </div>
                  <div className="relative overflow-hidden bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[32px] p-5 md:p-8 text-center shadow-sm">
                    <div className="absolute -bottom-6 -right-4 text-[80px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
                    <div className="relative z-10 text-2xl md:text-4xl font-black text-amber-500 mb-1 md:mb-2">Global</div>
                    <div className="relative z-10 text-xs md:text-sm font-semibold text-slate-500">Reach</div>
                  </div>
                  <div className="relative overflow-hidden bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[32px] p-5 md:p-8 text-center shadow-sm md:translate-y-8">
                    <div className="absolute -bottom-6 -right-4 text-[80px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
                    <div className="relative z-10 text-2xl md:text-4xl font-black text-amber-500 mb-1 md:mb-2">Flexible</div>
                    <div className="relative z-10 text-xs md:text-sm font-semibold text-slate-500">Hours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="flex items-center justify-around p-2 bg-white rounded-[32px] shadow-2xl shadow-black/40">
          <Link href="/register" className="flex-1 py-3 text-center rounded-[24px] bg-amber-500 text-black font-bold text-sm">
            Sign Up
          </Link>
          <Link href="/login" className="flex-1 py-3 text-center rounded-[24px] text-black font-bold text-sm">
            Log In
          </Link>
        </div>
      </div>

      <div className="pb-32 md:pb-12"></div>

      <div className="pb-32 md:pb-12"></div>
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black py-8 md:py-12 mt-12">
        <div className="container mx-auto px-6 text-center text-white/50 text-sm">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service (EULA)</Link>
            <a href="mailto:support@astrosolution.com" className="hover:text-white transition-colors">Contact Support</a>
          </div>
          <p>&copy; {new Date().getFullYear()} Astro Solution. All rights reserved.</p>
          <p className="mt-2 text-xs text-white/30">Astrological guidance is for spiritual and entertainment purposes only.</p>
        </div>
      </footer>
    </div>
    </div>
  );
}
