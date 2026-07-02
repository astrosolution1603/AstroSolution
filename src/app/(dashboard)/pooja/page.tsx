"use client";

import { Button } from "@/components/ui/button";

import { useState } from "react";

const POOJA_PACKAGES = [
  {
    id: "basic_sankalp",
    title: "Basic Sankalp Pooja",
    price: 501,
    icon: "🪔",
    description: "A simple personalized prayer (Sankalp) offered in your name at a sacred temple.",
    features: ["Personalized Sankalp", "Live Video clip (2 mins)", "Prasad sent via post"],
    popular: false,
    gradient: "from-orange-500/20 to-amber-500/20",
    border: "border-amber-500/30"
  },
  {
    id: "navagraha",
    title: "Navagraha Shanti",
    price: 2100,
    icon: "🪐",
    description: "Pacify the nine planets to remove obstacles and bring harmony to your life.",
    features: ["9 Planets Mantra Jaap", "Havan/Fire Ritual", "Live stream link", "Blessed Yantra"],
    popular: true,
    gradient: "from-amber-500/30 to-orange-600/30",
    border: "border-amber-400"
  },
  {
    id: "maha_mrityunjaya",
    title: "Maha Mrityunjaya Jaap",
    price: 11000,
    icon: "🔱",
    description: "Powerful 11,000 Jaap dedicated to Lord Shiva for health, longevity, and healing.",
    features: ["11,000 Mantra Chants", "Performed by 3 Pandits", "Full HD Live Stream", "Rudraksha & Bhasma"],
    popular: false,
    gradient: "from-rose-500/20 to-red-600/20",
    border: "border-red-500/30"
  },
  {
    id: "kaal_sarp",
    title: "Kaal Sarp Dosh Nivaran",
    price: 21000,
    icon: "🐍",
    description: "Complete ritual performed at Trimbakeshwar or Ujjain to nullify Kaal Sarp Dosh.",
    features: ["Authentic Teerth Kshetra", "Performed by 5 Pandits", "Nag-Nagin Visarjan", "Silver Swastik & Prasad"],
    popular: false,
    gradient: "from-indigo-500/20 to-blue-600/20",
    border: "border-indigo-500/30"
  },
  {
    id: "ati_rudra",
    title: "Ati Rudra Maha Yagya",
    price: 51000,
    icon: "🕉️",
    description: "The ultimate Vedic ritual for immense prosperity, karmic cleansing, and spiritual upliftment.",
    features: ["11 Days Ritual", "Performed by 11 Pandits", "Continuous Vedic Chanting", "Exclusive VIP Access"],
    popular: false,
    gradient: "from-fuchsia-600/20 to-purple-800/20",
    border: "border-fuchsia-500/40"
  }
];

export default function PoojaPage() {
  const [bookingStatus, setBookingStatus] = useState<Record<string, string>>({});

  const handleBook = async (pooja: typeof POOJA_PACKAGES[0]) => {
    setBookingStatus(prev => ({ ...prev, [pooja.id]: "processing" }));
    
    try {
      const res = await fetch("/api/pooja/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          poojaId: pooja.id, 
          poojaTitle: pooja.title, 
          price: pooja.price 
        })
      });

      if (res.ok) {
        setBookingStatus(prev => ({ ...prev, [pooja.id]: "success" }));
        alert(`Successfully requested booking for ${pooja.title}. Our temple coordinator will contact you shortly to finalize the dates.`);
      } else {
        throw new Error("Booking failed");
      }
    } catch (error) {
      setBookingStatus(prev => {
        const next = { ...prev };
        delete next[pooja.id];
        return next;
      });
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Sacred e-Pooja Services</h1>
        <p className="text-slate-600 dark:text-white/60">
          Have authentic Vedic rituals performed on your behalf by expert Pandits at sacred temples. 
          Watch live from anywhere in the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POOJA_PACKAGES.map((pooja) => (
          <div 
            key={pooja.id} 
            className={`relative flex flex-col bg-white dark:bg-gradient-to-br dark:${pooja.gradient} border ${pooja.border} rounded-2xl p-6 md:p-8 transition-transform hover:-translate-y-1 shadow-sm dark:shadow-none`}
          >
            {pooja.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Most Popular
              </div>
            )}
            
            <div className="text-5xl mb-4 text-center">{pooja.icon}</div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">{pooja.title}</h3>
            
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">₹{pooja.price.toLocaleString("en-IN")}</span>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-white/70 text-center mb-6 min-h-[40px]">
              {pooja.description}
            </p>
            
            <div className="flex-1 space-y-3 mb-8">
              {pooja.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-800 dark:text-white/80">
                  <span className="text-amber-600 dark:text-amber-500 mt-0.5">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => handleBook(pooja)}
              disabled={!!bookingStatus[pooja.id]}
              className={`w-full py-6 text-base font-bold transition-all ${
                bookingStatus[pooja.id] === "success"
                  ? "bg-green-500 hover:bg-green-600 text-white border-none"
                  : pooja.popular 
                    ? "bg-amber-500 hover:bg-amber-400 text-black" 
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border dark:border-white/20"
              }`}
            >
              {bookingStatus[pooja.id] === "processing" ? "Processing..." : 
               bookingStatus[pooja.id] === "success" ? "✓ Booking Requested" : "Book Now"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
