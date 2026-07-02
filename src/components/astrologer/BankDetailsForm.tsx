"use client";

import { useState } from "react";
import { Building2, Save } from "lucide-react";

interface BankDetails {
  bankAccountHolder: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  bankName: string;
}

export function BankDetailsForm({ initialDetails }: { initialDetails: BankDetails }) {
  const [details, setDetails] = useState<BankDetails>(initialDetails);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/astrologer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details)
      });
      if (res.ok) {
        setMessage("Bank details saved successfully!");
      } else {
        setMessage("Failed to save bank details.");
      }
    } catch (e) {
      console.error(e);
      setMessage("Error saving details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mt-6">
      <div className="p-6 border-b border-white/10 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl font-bold">Bank Details for Payouts</h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Account Holder Name</label>
            <input 
              type="text" 
              value={details.bankAccountHolder || ""}
              onChange={(e) => setDetails({ ...details, bankAccountHolder: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Bank Name</label>
            <input 
              type="text" 
              value={details.bankName || ""}
              onChange={(e) => setDetails({ ...details, bankName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
              placeholder="e.g. HDFC Bank"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Account Number</label>
            <input 
              type="text" 
              value={details.bankAccountNumber || ""}
              onChange={(e) => setDetails({ ...details, bankAccountNumber: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
              placeholder="Enter Account Number"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">IFSC Code</label>
            <input 
              type="text" 
              value={details.bankIfscCode || ""}
              onChange={(e) => setDetails({ ...details, bankIfscCode: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
              placeholder="e.g. HDFC0001234"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Details"}
          </button>
          {message && <span className="text-sm text-amber-400 font-medium">{message}</span>}
        </div>
      </div>
    </div>
  );
}
