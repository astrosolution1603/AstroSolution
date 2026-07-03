"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical, Star, AlertTriangle, X } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { getAstrologer } from "@/lib/astrologers";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "english", label: "English", flag: "🇬🇧", desc: "English" },
  { code: "hindi", label: "हिंदी", flag: "🇮🇳", desc: "Hindi" },
];

interface ChatWindowProps {
  sessionId: string;
  initialMessages?: any[];
  userName: string;
  astrologerId?: string | null;
  injectedPrompt?: string | null;
  humanAstrologers?: { id: string; name: string }[];
}

const QUICK_PROMPTS: Record<string, string[]> = {
  english: [
    "How will my day be?",
    "My career this year",
    "When will I marry?",
    "Any dosha in my kundli?",
    "Lucky gemstone for me",
    "Best time for new business"
  ],
  hindi: [
    "Aaj mera din kaisa rahega?",
    "Mera career kaisa rahega?",
    "Meri shadi kab hogi?",
    "Meri kundli mein dosh?",
    "Mera lucky gemstone?",
    "Naya business kab shuru karein?"
  ]
};

export default function ChatWindow({ sessionId, initialMessages = [], userName, injectedPrompt, astrologerId, humanAstrologers = [] }: ChatWindowProps) {
  const router = useRouter();

  if (!sessionId) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full items-center justify-center p-8 text-center bg-muted/50">
        <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 border border-amber-500/30 shadow-lg">
          <span className="text-4xl">🔮</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Astro Solution</h2>
        <p className="text-muted-foreground">Select an astrologer from the sidebar to begin your cosmic journey.</p>
      </div>
    );
  }

  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`chat_lang_${sessionId}`) || "";
    }
    return "";
  });

  // All messages stored locally (from DB polling + AI stream)
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiStreamText, setAiStreamText] = useState("");
  const lastMsgTimeRef = useRef<string | null>(
    initialMessages.length > 0 ? initialMessages[initialMessages.length - 1].createdAt : null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rating & Report State
  const [showMenu, setShowMenu] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [reportCategory, setReportCategory] = useState("Misbehavior");
  const [reportDesc, setReportDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const astrologer = astrologerId ? getAstrologer(astrologerId) : null;
  const humanAstro = humanAstrologers.find(h => h.id === astrologerId);
  const aiName = astrologer ? astrologer.name : humanAstro ? humanAstro.name : "Astro Solution";
  const aiAvatar = astrologer ? astrologer.avatar : humanAstro ? "🧑‍💼" : "🔮";

  const handleGurudakshina = async (amount: number) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat/gurudakshina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, amount }),
      });
      if (res.ok) {
        // Message will be picked up by the polling
      } else if (res.status === 402) {
        alert("Insufficient balance in your Astro Wallet. Please go to your Profile to top up.");
      } else {
        alert("Payment failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageSelect = (code: string) => {
    setLanguage(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`chat_lang_${sessionId}`, code);
    }
  };

  // Poll DB for new messages every 3s (catches astrologer replies)
  useEffect(() => {
    const poll = async () => {
      try {
        const url = `/api/chat/messages?sessionId=${sessionId}${lastMsgTimeRef.current ? `&after=${lastMsgTimeRef.current}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(prev => {
            const ids = new Set(prev.map((m: any) => m.id));
            const newMsgs = data.messages.filter((m: any) => !ids.has(m.id));
            if (newMsgs.length > 0) {
              lastMsgTimeRef.current = newMsgs[newMsgs.length - 1].createdAt;
              return [...prev.filter((m: any) => !m.id.startsWith("tmp-")), ...newMsgs];
            }
            return prev;
          });
        }
      } catch {}
    };

    const interval = setInterval(poll, 1000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, aiStreamText]);

  const submitRating = async () => {
    if (!astrologerId || rating === 0) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/chat/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ astrologerId, rating, feedback })
      });
      setShowRatingModal(false);
      setRating(0);
      setFeedback("");
      alert("Thank you for your rating!");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReport = async () => {
    if (!astrologerId || !reportDesc) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/chat/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ astrologerId, category: reportCategory, description: reportDesc })
      });
      setShowReportModal(false);
      setReportDesc("");
      alert("Report submitted successfully.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle injected prompts
  useEffect(() => {
    if (injectedPrompt) {
      sendMessage(injectedPrompt);
    }
  }, [injectedPrompt]);

  const sendMessage = async (content?: string) => {
    const text = (content || input).trim();
    if (!text || isLoading) return;

    setInput("");
    setIsLoading(true);
    setAiStreamText("");

    // Optimistically add user message to UI
    const tempUserMsg = { id: `tmp-${Date.now()}`, role: "user", content: text, senderRole: "USER", createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const allMessages = [...messages, tempUserMsg].map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, sessionId, language, astrologerId }),
      });

      if (!res.ok || !res.body) {
        setIsLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // keep the incomplete line in the buffer
        
        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const text = JSON.parse(line.slice(2));
              fullText += text;
              setAiStreamText(fullText);
            } catch (err) {
              console.error("Stream parse error:", err, "Line:", line);
            }
          }
        }
      }
      
      if (buffer.startsWith("0:")) {
         try {
           const text = JSON.parse(buffer.slice(2));
           fullText += text;
           setAiStreamText(fullText);
         } catch {}
      }

      setAiStreamText("");

      // After stream, poll for the saved AI message
      if (fullText) {
        setTimeout(async () => {
          const url = `/api/chat/messages?sessionId=${sessionId}${lastMsgTimeRef.current ? `&after=${lastMsgTimeRef.current}` : ""}`;
          const res2 = await fetch(url);
          if (res2.ok) {
            const data = await res2.json();
            if (data.messages?.length > 0) {
              setMessages(prev => {
                const ids = new Set(prev.map((m: any) => m.id));
                const newMsgs = data.messages.filter((m: any) => !ids.has(m.id));
                if (newMsgs.length > 0) {
                  lastMsgTimeRef.current = newMsgs[newMsgs.length - 1].createdAt;
                  return [...prev.filter((m: any) => !m.id.startsWith("tmp-")), ...newMsgs];
                }
                return prev;
              });
            }
          }
        }, 500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => sendMessage(prompt);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full relative">
      {/* Universal Header (Mobile & Desktop) */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/chat')} className="md:hidden text-foreground p-1 hover:bg-muted/50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{aiAvatar}</span>
            <span className="font-bold text-foreground">{aiName}</span>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-30 animate-in fade-in slide-in-from-top-2">
              <button 
                onClick={() => { setShowMenu(false); setShowRatingModal(true); }}
                className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
              >
                <Star className="w-4 h-4 text-amber-500" />
                Rate Astrologer
              </button>
              <button 
                onClick={() => { setShowMenu(false); setShowReportModal(true); }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Report Issue
              </button>
              <button 
                onClick={() => { setShowMenu(false); alert("User has been blocked."); router.push("/chat"); }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-2 border-t border-border"
              >
                <X className="w-4 h-4" />
                Block User
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {messages.length === 0 && !aiStreamText ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-6 px-4">
            <div className="space-y-3">
              <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mx-auto border shadow-xl", astrologer ? `bg-gradient-to-br ${astrologer.gradient} border-border` : "bg-amber-500/20 border-amber-500/30")}>
                <span className="text-5xl">{aiAvatar}</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Namaste, {userName}</h2>
              <p className="text-muted-foreground text-base">I am {aiName}. What does the universe hold for you today?</p>
            </div>

            {!language ? (
              <div className="w-full max-w-lg space-y-3">
                <p className="text-amber-600 dark:text-amber-400/80 text-sm font-medium tracking-wide uppercase">Choose your language / भाषा चुनें</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => handleLanguageSelect(lang.code)}
                      className="flex flex-col items-center gap-1 p-3 bg-card hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-border hover:border-amber-400 dark:hover:border-amber-500/50 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 group shadow-sm dark:shadow-none">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-sm font-semibold">{lang.label}</span>
                      <span className="text-[10px] text-muted-foreground/70 group-hover:text-amber-600 dark:group-hover:text-amber-400/60">{lang.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-lg space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-muted-foreground">Responding in:</span>
                  <span className="text-xs bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full font-medium">
                    {LANGUAGES.find(l => l.code === language)?.flag} {LANGUAGES.find(l => l.code === language)?.label}
                  </span>
                  <button onClick={() => handleLanguageSelect("")} className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground underline">change</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(QUICK_PROMPTS[language] || QUICK_PROMPTS.english).map((prompt, i) => (
                    <button key={i} onClick={() => handleQuickPrompt(prompt)}
                      className="p-3 text-sm text-left bg-card hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors shadow-sm dark:shadow-none">
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto pb-4">
            
            {/* Gurudakshina Button for Human Astrologer */}
            {humanAstro && (
              <div className="flex flex-col items-center justify-center mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <p className="text-sm text-amber-600 dark:text-amber-400 mb-3 text-center">
                  If you are satisfied with {aiName}'s guidance, you can voluntarily pay Gurudakshina.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-sm">
                  <button onClick={() => handleGurudakshina(101)} disabled={isLoading} className="px-4 py-2 bg-card hover:bg-amber-50 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold rounded-xl border border-amber-200 dark:border-amber-500/30 transition-colors shadow-sm">
                    ₹101
                  </button>
                  <button onClick={() => handleGurudakshina(501)} disabled={isLoading} className="px-4 py-2 bg-card hover:bg-amber-50 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold rounded-xl border border-amber-200 dark:border-amber-500/30 transition-colors shadow-sm">
                    ₹501
                  </button>
                  <button onClick={() => handleGurudakshina(1100)} disabled={isLoading} className="px-4 py-2 bg-card hover:bg-amber-50 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold rounded-xl border border-amber-200 dark:border-amber-500/30 transition-colors shadow-sm">
                    ₹1100
                  </button>
                  <button onClick={() => handleGurudakshina(5100)} disabled={isLoading} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors shadow-sm">
                    ₹5100
                  </button>
                </div>
                <span className="text-[10px] text-amber-600/60 dark:text-amber-400/50 mt-3 font-medium">Powered by Google Play Billing / App Store</span>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} avatar={
                message.senderRole === "ASTROLOGER" ? "🧑‍💼" : aiAvatar
              } />
            ))}

            {/* Live AI streaming text */}
            {isLoading && aiStreamText && (
              <div className="flex gap-3 mb-4">
                <div className="w-9 h-9 shrink-0 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 flex items-center justify-center text-lg">{aiAvatar}</div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3 text-sm text-foreground max-w-[80%] shadow-sm dark:shadow-none">
                  {aiStreamText}
                  <span className="inline-block w-1.5 h-4 bg-amber-500 dark:bg-amber-400 ml-1 animate-pulse" />
                </div>
              </div>
            )}

            {/* Waiting for response */}
            {isLoading && !aiStreamText && (
              <div className="flex items-center space-x-2 text-muted-foreground text-sm ml-4 mt-4">
                <span className="text-lg">🔮</span>
                <span>Reading the stars</span>
                <span className="flex space-x-1 mt-1.5 ml-1">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 pb-20 md:pb-4 bg-transparent border-t border-border">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            input={input}
            handleInputChange={e => setInput(e.target.value)}
            handleSubmit={e => { e?.preventDefault(); sendMessage(); }}
            isLoading={isLoading}
          />
          <p className="text-center text-[10px] text-muted-foreground/70 mt-3">
            AI can make mistakes. Astrological guidance is for spiritual purposes only.
          </p>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-bold text-lg">Rate {aiName}</h3>
              <button onClick={() => setShowRatingModal(false)} className="p-1 hover:bg-muted rounded-full">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star className={cn("w-10 h-10 transition-colors", rating >= star ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground")} />
                  </button>
                ))}
              </div>
              <textarea 
                placeholder="Leave feedback (optional)..." 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full h-24 p-3 bg-muted rounded-xl border border-border text-sm resize-none focus:outline-none focus:border-amber-500 mb-6"
              />
              <button 
                onClick={submitRating}
                disabled={rating === 0 || isSubmitting}
                className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-bold text-lg text-destructive">Report {aiName}</h3>
              <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-muted rounded-full">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold mb-2">Category</label>
              <select 
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                className="w-full p-3 bg-muted rounded-xl border border-border text-sm focus:outline-none focus:border-destructive mb-4"
              >
                <option value="Misbehavior">Misbehavior / Harassment</option>
                <option value="Spam">Spam / Advertising</option>
                <option value="Fake Profile">Fake Profile / Scammer</option>
                <option value="Other">Other</option>
              </select>

              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea 
                placeholder="Please describe the issue..." 
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                className="w-full h-32 p-3 bg-muted rounded-xl border border-border text-sm resize-none focus:outline-none focus:border-destructive mb-6"
              />
              <button 
                onClick={submitReport}
                disabled={!reportDesc.trim() || isSubmitting}
                className="w-full py-3 bg-destructive text-white rounded-xl font-bold hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
