"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MatchPage() {
  const router = useRouter();
  const [partner, setPartner] = useState({ name: "", dob: "", tob: "", pob: "" });

  const [isMatching, setIsMatching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMatching(true);
    const prompt = `Please check my kundli compatibility (Ashtakoot Guna Milan) with ${partner.name}, born on ${partner.dob} at ${partner.tob || "unknown time"} in ${partner.pob}. Give me the score out of 36 and a detailed breakdown.`;
    
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ astrologerId: "balkrishna", title: `Kundli Match: ${partner.name}` })
      });
      
      if (res.ok) {
        const data = await res.json();
        router.push(`/chat?session=${data.id}&prompt=${encodeURIComponent(prompt)}`);
      }
    } catch (e) {
      setIsMatching(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Kundli Matching</h1>
        <p className="text-slate-600 dark:text-white/60">Check compatibility with your partner for marriage or relationship.</p>
      </div>

      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Partner's Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-white/70 mb-1">Partner's Name *</label>
            <Input required value={partner.name} onChange={e => setPartner({...partner, name: e.target.value})} className="bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-white/70 mb-1">Date of Birth *</label>
            <Input required type="date" value={partner.dob} onChange={e => setPartner({...partner, dob: e.target.value})} className="bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-white/70 mb-1">Time of Birth (Optional)</label>
            <Input type="time" value={partner.tob} onChange={e => setPartner({...partner, tob: e.target.value})} className="bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-white/70 mb-1">Place of Birth *</label>
            <Input required value={partner.pob} onChange={e => setPartner({...partner, pob: e.target.value})} className="bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white" placeholder="City, Country" />
          </div>
          <Button type="submit" disabled={isMatching} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-6 mt-4">
            {isMatching ? "Calculating Match..." : "Check Compatibility Score"}
          </Button>
        </form>
      </div>

      <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-6 text-center border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
        <h3 className="text-slate-900 dark:text-white font-medium mb-2">Overall Score: -- / 36</h3>
        <p className="text-sm text-slate-500 dark:text-white/40">Enter partner details to generate Kundli matching report.</p>
      </div>
    </div>
  );
}
