"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const TITHIS = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", "Amavasya"];
const NAKSHATRAS = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
const YOGAS = ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
const KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kintughna"];

export default function PanchangPage() {
  const router = useRouter();
  const [isAsking, setIsAsking] = useState(false);
  const now = new Date();
  
  // Deterministic index based on date
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  
  const today = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const tithi = TITHIS[dayOfYear % 15] + (dayOfYear % 30 < 15 ? " (Shukla Paksha)" : " (Krishna Paksha)");
  const nakshatra = NAKSHATRAS[dayOfYear % 27];
  const yoga = YOGAS[dayOfYear % 27];
  const karana = KARANAS[(dayOfYear * 2) % 11];

  const handleAskAI = async () => {
    setIsAsking(true);
    const prompt = `What is today's detailed Panchang (${today}) including Tithi (${tithi}), Nakshatra (${nakshatra}), Yoga (${yoga}), and Karana (${karana})? How does this combination affect my zodiac sign today?`;
    
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ astrologerId: "tripathi", title: `Daily Panchang` })
      });
      
      if (res.ok) {
        const data = await res.json();
        router.push(`/chat?session=${data.id}&prompt=${encodeURIComponent(prompt)}`);
      }
    } catch (e) {
      setIsAsking(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Daily Panchang</h1>
        <p className="text-slate-600 dark:text-white/60">Vedic almanac and auspicious timings for today.</p>
      </div>

      <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-6 text-center shadow-sm dark:shadow-none">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{today}</h2>
        <p className="text-amber-700 dark:text-amber-200">The cosmic alignment of the day</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Panchang Elements</h3>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-500 dark:text-white/50">Tithi</span>
            <span className="text-slate-900 dark:text-white">{tithi}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-500 dark:text-white/50">Nakshatra</span>
            <span className="text-slate-900 dark:text-white">{nakshatra}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-500 dark:text-white/50">Yoga</span>
            <span className="text-slate-900 dark:text-white">{yoga}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-500 dark:text-white/50">Karana</span>
            <span className="text-slate-900 dark:text-white">{karana}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Muhurat (Timings)</h3>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-500 dark:text-white/50">Sunrise</span>
            <span className="text-slate-900 dark:text-white">06:14 AM</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-slate-500 dark:text-white/50">Sunset</span>
            <span className="text-slate-900 dark:text-white">06:45 PM</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-red-500 dark:text-red-400">Rahu Kalam</span>
            <span className="text-slate-900 dark:text-white">04:30 PM - 06:00 PM</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-green-600 dark:text-green-400">Abhijit Muhurat</span>
            <span className="text-slate-900 dark:text-white">11:58 AM - 12:48 PM</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Button 
          onClick={handleAskAI}
          disabled={isAsking}
          className="inline-block px-8 py-6 bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white font-medium rounded-xl transition-colors text-lg shadow-sm dark:shadow-none"
        >
          {isAsking ? "Connecting to Astrologer..." : "Ask AI for Detailed Panchang Insights"}
        </Button>
      </div>
    </div>
  );
}
