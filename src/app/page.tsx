"use client";

import { useState, useRef } from "react";
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
      <div className="min-h-screen overflow-x-hidden selection:bg-amber-500/30 pb-safe relative text-white">
        
        {/* Global Background Layer */}
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

        {/* Minimalist Navbar with Hamburger */}
        <nav className="absolute top-0 left-0 right-0 z-50 w-full pt-6 md:pt-10 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Logo />
            
            {/* Desktop Nav */}
            <div className="hidden md:flex gap-10 items-center text-sm font-bold tracking-widest uppercase text-white/80">
              <Link href="#features" className="hover:text-white transition-colors drop-shadow-md">Features</Link>
            </div>
            
            {/* Mobile Hamburger Menu Toggle */}
            <button 
              className="md:hidden p-2 text-white relative z-[60]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-8 h-8 text-amber-500" /> : <Menu className="w-8 h-8 text-amber-500" />}
            </button>
          </div>
        </nav>

        {/* Mobile Fullscreen Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 animate-in fade-in duration-300">
            <Link onClick={() => setIsMenuOpen(false)} href="/register" className="text-2xl font-bold text-amber-500 hover:text-amber-400">Sign Up as User</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/login" className="text-2xl font-bold text-white hover:text-gray-300">Log In as User</Link>
            <div className="w-24 h-px bg-white/20 my-4"></div>
            <Link onClick={() => setIsMenuOpen(false)} href="/astrologer-register" className="text-2xl font-bold text-amber-500 hover:text-amber-400">Apply as Astrologer</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/astrologer-login" className="text-2xl font-bold text-white hover:text-gray-300">Astrologer Log In</Link>
          </div>
        )}

        {/* Swipeable Hero Section */}
        <section className="relative min-h-[100dvh] pt-28 pb-12 overflow-hidden z-10 flex flex-col justify-center">
          
          <div className="container relative z-10 mx-auto text-center flex flex-col items-center mb-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-white/20 text-black shadow-lg animate-fade-in">
              <span className="text-amber-500 font-serif text-xl leading-none">ॐ</span>
              <span className="text-xs md:text-sm font-bold tracking-wide">Your Cosmic Journey Begins</span>
            </div>
          </div>

          {/* Snap Scrolling Slider Container */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory w-full relative z-10 px-4 md:px-0 scroll-smooth [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Slide 1: Users */}
            <div className="w-full flex-shrink-0 snap-center flex justify-center px-2 md:px-6">
              <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-2xl shadow-black/40 w-full max-w-4xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -top-16 -right-10 text-[200px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
                <div className="absolute -bottom-16 -left-10 text-[200px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
                
                <h1 className="relative z-10 text-3xl md:text-7xl font-black tracking-tight mb-6 leading-tight text-center">
                  <span className="text-black block mb-2">Unlock the Secrets of</span>
                  <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-800 text-transparent bg-clip-text drop-shadow-sm">
                    Your Destiny
                  </span>
                </h1>
                
                <p className="relative z-10 text-sm md:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto font-medium text-center mb-8">
                  Connect with premium AI Vedic Astrologers. Ask about your career, love life, and true life path instantly.
                </p>

                <div className="flex flex-col gap-4 relative z-10 mt-auto">
                  <Link 
                    href="/register" 
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-[24px] transition-all shadow-xl active:scale-95"
                  >
                    <UserPlus className="w-5 h-5" />
                    Create Free Account
                  </Link>
                  <Link 
                    href="/login" 
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-black font-bold rounded-[24px] transition-all shadow-xl active:scale-95"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Link>
                </div>
              </div>
            </div>

            {/* Slide 2: Astrologers */}
            <div className="w-full flex-shrink-0 snap-center flex justify-center px-2 md:px-6">
              <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-2xl shadow-black/40 w-full max-w-4xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -top-16 -right-10 text-[200px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
                <div className="absolute -bottom-16 -left-10 text-[200px] text-amber-500/5 select-none pointer-events-none font-serif leading-none">ॐ</div>
                
                <div className="inline-flex self-center items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest mb-4 shadow-sm z-10">
                  For Astrologers
                </div>

                <h2 className="relative z-10 text-3xl md:text-5xl font-black text-black mb-4 leading-tight text-center">
                  Are you a Certified <br className="hidden md:block" />
                  <span className="text-amber-500">Vedic Astrologer?</span>
                </h2>
                
                <p className="relative z-10 text-sm md:text-lg text-slate-700 leading-relaxed max-w-lg mx-auto font-medium text-center mb-8">
                  Join our platform as an official astrologer. Provide live guidance to thousands of users globally and monetize your cosmic expertise.
                </p>

                <div className="flex flex-col gap-4 relative z-10 mt-auto">
                  <Link 
                    href="/astrologer-register" 
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-[24px] hover:bg-slate-900 transition-all shadow-xl active:scale-95"
                  >
                    Apply as Astrologer
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/astrologer-login" 
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-black font-bold rounded-[24px] transition-all active:scale-95 shadow-xl"
                  >
                    <LogIn className="w-5 h-5" />
                    Astrologer Login
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mt-6 relative z-10">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl py-3 text-center">
                    <div className="text-xl font-black text-amber-500">50k+</div>
                    <div className="text-[10px] font-semibold text-slate-500">Active Users</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl py-3 text-center">
                    <div className="text-xl font-black text-amber-500">Instant</div>
                    <div className="text-[10px] font-semibold text-slate-500">Payouts</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl py-3 text-center">
                    <div className="text-xl font-black text-amber-500">Global</div>
                    <div className="text-[10px] font-semibold text-slate-500">Reach</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl py-3 text-center">
                    <div className="text-xl font-black text-amber-500">Flexible</div>
                    <div className="text-[10px] font-semibold text-slate-500">Hours</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Slider Dots */}
          <div className="flex justify-center items-center gap-2 mt-8 relative z-10">
            <div className={`h-2 rounded-full transition-all duration-300 ${activeSlide === 0 ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'}`} />
            <div className={`h-2 rounded-full transition-all duration-300 ${activeSlide === 1 ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'}`} />
          </div>

        </section>
        
        {/* Features Section */}
        <section id="features" className="px-6 py-24 relative z-10 mt-12">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6">
              Cosmic Offerings
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-16">
              Everything you need for your <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">Spiritual Journey</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md hover:bg-white/10 transition-colors shadow-2xl">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-black mb-6 shadow-lg">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Live Astrology Chat</h3>
                <p className="text-white/70 leading-relaxed font-medium">Connect instantly with verified Vedic astrologers for personalized guidance on career, love, and life.</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md hover:bg-white/10 transition-colors shadow-2xl">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-black mb-6 shadow-lg">
                  <Star className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Authentic Gemstones</h3>
                <p className="text-white/70 leading-relaxed font-medium">Shop for certified, lab-tested precious gemstones to balance your planetary energies and doshas.</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md hover:bg-white/10 transition-colors shadow-2xl">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-black mb-6 shadow-lg">
                  <UserPlus className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Online Pujas</h3>
                <p className="text-white/70 leading-relaxed font-medium">Book authentic Vedic rituals and pujas performed by experienced pandits on your behalf.</p>
              </div>
            </div>
          </div>
        </section>      

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
