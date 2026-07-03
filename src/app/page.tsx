"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Sparkles, UserPlus, LogIn, ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function DemoHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      setActiveSlide(index);
    }
  };

  return (
    <div data-theme="cosmic" className="dark bg-black text-white">
      <div className="h-[100dvh] overflow-hidden selection:bg-amber-500/30 relative text-white flex flex-col">
        
        {/* Global Background Layer */}
        <div className="absolute top-0 left-0 w-full h-[120vh] overflow-hidden pointer-events-none z-0 bg-black">
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

        {/* Minimalist Navbar with Hamburger */}
        <nav className="relative z-50 w-full pt-6 md:pt-10 px-6 md:px-12 shrink-0 h-24">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Logo />
            
            {/* Mobile Hamburger Menu Toggle */}
            <button 
              className="p-2 text-white relative z-[60]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-8 h-8 text-amber-500" /> : <Menu className="w-8 h-8 text-amber-500" />}
            </button>
          </div>
        </nav>

        {/* Mobile Fullscreen Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 animate-in fade-in duration-300">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-2 text-amber-500">
              <X className="w-8 h-8" />
            </button>
            <Link onClick={() => setIsMenuOpen(false)} href="/privacy" className="text-2xl font-bold text-white hover:text-amber-500 transition-colors">Privacy Policy</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/terms" className="text-2xl font-bold text-white hover:text-amber-500 transition-colors">Terms of Service (EULA)</Link>
            <a onClick={() => setIsMenuOpen(false)} href="mailto:support@astrosolution.com" className="text-2xl font-bold text-white hover:text-amber-500 transition-colors">Contact Support</a>
          </div>
        )}

        {/* Swipeable Horizontal Hero Section */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth relative z-10 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* SLIDE 1: Users (Unlock Secrets) */}
          <div className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center px-4 md:px-6">
            <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-14 shadow-2xl shadow-black/40 w-full max-w-4xl relative overflow-hidden flex flex-col justify-center gap-4 md:gap-8">
              <div className="absolute -top-16 -right-10 text-[200px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
              <div className="absolute -bottom-16 -left-10 text-[200px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
              
              <div className="inline-flex self-center items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest shadow-sm z-10">
                Your Cosmic Journey Begins
              </div>

              <h1 className="relative z-10 text-3xl md:text-7xl font-black tracking-tight leading-tight text-center">
                <span className="text-black block mb-1 md:mb-2">Unlock the Secrets of</span>
                <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-800 text-transparent bg-clip-text drop-shadow-sm">
                  Your Destiny
                </span>
              </h1>
              
              <p className="relative z-10 text-xs md:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto font-medium text-center">
                Connect with premium AI Vedic Astrologers. Ask about your career, love life, and true life path instantly.
              </p>

              <div className="flex flex-col gap-3 relative z-10 mt-2">
                <Link 
                  href="/register" 
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-[20px] transition-all shadow-xl active:scale-95"
                >
                  <UserPlus className="w-5 h-5" />
                  Create Free Account
                </Link>
                <Link 
                  href="/login" 
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-black font-bold rounded-[20px] transition-all shadow-xl active:scale-95"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* SLIDE 2: Features (Vertical Swiper) */}
          <div className="w-full h-full flex-shrink-0 snap-center relative">
            <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              
              {/* Feature 1: Live Chat */}
              <div className="h-full w-full flex-shrink-0 snap-center flex items-center justify-center px-4 md:px-6 relative">
                <div className="absolute top-4 w-full flex justify-center pointer-events-none animate-bounce">
                  <span className="text-white/50 text-[10px] tracking-widest uppercase font-bold bg-black/40 px-3 py-1 rounded-full">Swipe down for more</span>
                </div>
                <div className="bg-white rounded-[32px] md:rounded-[40px] p-8 shadow-2xl shadow-black/40 w-full max-w-4xl relative overflow-hidden flex flex-col items-center justify-center gap-6 text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg relative z-10">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="relative z-10 text-3xl font-black text-black">Live Astrology Chat</h3>
                  <p className="relative z-10 text-sm text-slate-700 leading-relaxed max-w-sm mx-auto font-medium">
                    Connect instantly with verified Vedic astrologers for personalized guidance on career, love, and life.
                  </p>
                  <Link href="/register" className="relative z-10 w-full max-w-xs flex items-center justify-center gap-2 px-8 py-3 bg-black text-white font-bold rounded-[20px] shadow-xl active:scale-95">
                    Start Chatting
                  </Link>
                </div>
              </div>

              {/* Feature 2: Gemstones */}
              <div className="h-full w-full flex-shrink-0 snap-center flex items-center justify-center px-4 md:px-6">
                <div className="bg-white rounded-[32px] md:rounded-[40px] p-8 shadow-2xl shadow-black/40 w-full max-w-4xl relative overflow-hidden flex flex-col items-center justify-center gap-6 text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg relative z-10">
                    <Star className="w-8 h-8" />
                  </div>
                  <h3 className="relative z-10 text-3xl font-black text-black">Authentic Gemstones</h3>
                  <p className="relative z-10 text-sm text-slate-700 leading-relaxed max-w-sm mx-auto font-medium">
                    Shop for certified, lab-tested precious gemstones to balance your planetary energies and doshas.
                  </p>
                  <Link href="/shop" className="relative z-10 w-full max-w-xs flex items-center justify-center gap-2 px-8 py-3 bg-black text-white font-bold rounded-[20px] shadow-xl active:scale-95">
                    Visit Shop
                  </Link>
                </div>
              </div>

              {/* Feature 3: Pujas */}
              <div className="h-full w-full flex-shrink-0 snap-center flex items-center justify-center px-4 md:px-6">
                <div className="bg-white rounded-[32px] md:rounded-[40px] p-8 shadow-2xl shadow-black/40 w-full max-w-4xl relative overflow-hidden flex flex-col items-center justify-center gap-6 text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg relative z-10">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h3 className="relative z-10 text-3xl font-black text-black">Online Pujas</h3>
                  <p className="relative z-10 text-sm text-slate-700 leading-relaxed max-w-sm mx-auto font-medium">
                    Book authentic Vedic rituals and pujas performed by experienced pandits on your behalf.
                  </p>
                  <Link href="/pooja" className="relative z-10 w-full max-w-xs flex items-center justify-center gap-2 px-8 py-3 bg-black text-white font-bold rounded-[20px] shadow-xl active:scale-95">
                    Book a Puja
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* SLIDE 3: Astrologers */}
          <div className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center px-4 md:px-6">
            <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-14 shadow-2xl shadow-black/40 w-full max-w-4xl relative overflow-hidden flex flex-col justify-center gap-2 md:gap-6">
              <div className="absolute -top-16 -right-10 text-[200px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
              <div className="absolute -bottom-16 -left-10 text-[200px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
              
              <div className="inline-flex self-center items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest shadow-sm z-10">
                For Astrologers
              </div>

              <h2 className="relative z-10 text-2xl md:text-5xl font-black text-black leading-tight text-center">
                Are you a Certified <br className="hidden md:block" />
                <span className="text-amber-500">Vedic Astrologer?</span>
              </h2>
              
              <p className="relative z-10 text-xs md:text-lg text-slate-700 leading-relaxed max-w-lg mx-auto font-medium text-center">
                Join our platform as an official astrologer. Provide live guidance to thousands of users globally.
              </p>

              <div className="flex flex-col gap-2 relative z-10 mt-1 md:mt-2">
                <Link 
                  href="/astrologer-register" 
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-black text-white font-bold rounded-[20px] hover:bg-slate-900 transition-all shadow-xl active:scale-95 text-sm"
                >
                  Apply as Astrologer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/astrologer-login" 
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-black font-bold rounded-[20px] transition-all active:scale-95 shadow-xl text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Astrologer Login
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-1 mt-2 relative z-10">
                <div className="bg-slate-50 border border-slate-100 rounded-xl py-2 text-center">
                  <div className="text-sm font-black text-amber-500">50k+</div>
                  <div className="text-[9px] font-semibold text-slate-500 leading-tight">Users</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl py-2 text-center">
                  <div className="text-sm font-black text-amber-500">Fast</div>
                  <div className="text-[9px] font-semibold text-slate-500 leading-tight">Payout</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl py-2 text-center">
                  <div className="text-sm font-black text-amber-500">Global</div>
                  <div className="text-[9px] font-semibold text-slate-500 leading-tight">Reach</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl py-2 text-center">
                  <div className="text-sm font-black text-amber-500">Flex</div>
                  <div className="text-[9px] font-semibold text-slate-500 leading-tight">Hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Slider Dots */}
        <div className="shrink-0 h-16 flex justify-center items-center gap-2 relative z-10">
          <div className={`h-2 rounded-full transition-all duration-300 ${activeSlide === 0 ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${activeSlide === 1 ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${activeSlide === 2 ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'}`} />
        </div>

      </div>
    </div>
  );
}
