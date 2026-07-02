"use client";

import { useState, useEffect } from "react";
import { Trash2, UserCheck, RefreshCw } from "lucide-react";

interface Astrologer {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  profileComplete: boolean;
  subscriptionStatus: string;
  subscriptionExpiry: string | null;
}

export default function ManageAstrologersPage() {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchAstrologers = async () => {
    const res = await fetch("/api/masterpanel/astrologers");
    if (res.ok) setAstrologers(await res.json());
  };

  useEffect(() => { fetchAstrologers(); }, []);

  const deleteAstrologer = async (id: string, name: string) => {
    if (!confirm(`Remove astrologer "${name}"?`)) return;
    const res = await fetch("/api/masterpanel/astrologers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchAstrologers();
  };

  const toggleSubscription = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    if (!confirm(`Change subscription status to ${newStatus}?`)) return;
    
    setLoadingId(id);
    const res = await fetch("/api/masterpanel/astrologers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, subscriptionStatus: newStatus }),
    });
    setLoadingId(null);
    
    if (res.ok) fetchAstrologers();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manage Astrologers</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage astrologer subscriptions and access.</p>
      </div>

      <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <div className="p-5 border-b border-slate-200 flex items-center gap-2 bg-slate-50">
          <UserCheck className="w-5 h-5 text-amber-500" />
          <h2 className="font-bold text-slate-900">Registered Astrologers ({astrologers.length})</h2>
        </div>
        {astrologers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium">No astrologers registered yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {astrologers.map(a => {
              const isExpired = a.subscriptionStatus === "INACTIVE" || (a.subscriptionExpiry && new Date(a.subscriptionExpiry) < new Date());
              return (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{a.name}</div>
                      <div className="text-sm font-medium text-slate-500">📞 {a.phone}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col text-sm">
                      <span className="text-slate-500 mb-1 font-bold text-xs uppercase tracking-wider">Subscription</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${!isExpired ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}`}>
                          {!isExpired ? "ACTIVE" : "INACTIVE"}
                        </span>
                        {a.subscriptionExpiry && (
                          <span className="text-slate-500 text-xs border-l border-slate-200 pl-2 font-medium">
                            Expires: {new Date(a.subscriptionExpiry).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSubscription(a.id, !isExpired ? "ACTIVE" : "INACTIVE")}
                        disabled={loadingId === a.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          !isExpired 
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                        } disabled:opacity-50`}
                      >
                        {loadingId === a.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                        {!isExpired ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteAstrologer(a.id, a.name)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
