"use client";

import { useState } from "react";
import { Send, BellRing } from "lucide-react";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [target, setTarget] = useState("ALL");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/masterpanel/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, url, target })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(`Success! Notification queued for ${data.count} users.`);
        setTitle("");
        setBody("");
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (err) {
      setResult("Failed to send notification.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BellRing className="text-primary w-8 h-8" />
            Push Notifications
          </h1>
          <p className="text-muted-foreground mt-1">Send manual alerts to users and astrologers.</p>
        </div>
      </div>

      <form onSubmit={handleSend} className="bg-card p-8 rounded-2xl border border-white/5 shadow-sm space-y-5">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Target Audience</label>
          <select 
            value={target} 
            onChange={(e) => setTarget(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
          >
            <option value="ALL">Everyone (Users & Astrologers)</option>
            <option value="USER">Users Only</option>
            <option value="ASTROLOGER">Astrologers Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">Notification Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Special Offer!"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">Notification Body</label>
          <textarea 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="e.g. Get 20% off on your next Pooja booking."
            required
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">On Click URL (Optional)</label>
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. /pooja"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
          />
        </div>

        <button 
          type="submit"
          disabled={sending}
          className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          {sending ? "Sending..." : "Broadcast Notification"}
        </button>

        {result && (
          <div className={`p-4 rounded-lg text-center font-medium ${result.includes('Success') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {result}
          </div>
        )}
      </form>
    </div>
  );
}
