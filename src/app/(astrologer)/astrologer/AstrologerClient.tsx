"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Send, LogOut, MessageCircle, AlertCircle, Zap } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NotificationBell } from "@/components/ui/NotificationBell";

interface Message {
  id: string;
  role: string;
  content: string;
  senderRole: string;
  createdAt: string;
}

interface Session {
  id: string;
  astrologerId?: string | null;
  astrologerUserId?: string | null;
  updatedAt: string;
  user: { name: string; phone: string };
  messages: Message[];
}

export default function AstrologerDashboard({ astrologerName, astrologerId }: { astrologerName: string; astrologerId: string }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageTime = useRef<string | null>(null);

  // Poll sessions list every 5s
  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch("/api/astrologer/chat");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    };
    fetchSessions();
    const interval = setInterval(fetchSessions, 2000);
    return () => clearInterval(interval);
  }, []);

  // Poll messages in active session every 3s
  useEffect(() => {
    if (!activeSessionId) return;

    const fetchMessages = async () => {
      const url = `/api/chat/messages?sessionId=${activeSessionId}${lastMessageTime.current ? `&after=${lastMessageTime.current}` : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.messages.length > 0) {
          setMessages(prev => {
            const ids = new Set(prev.map((m: Message) => m.id));
            const newMsgs = data.messages.filter((m: Message) => !ids.has(m.id));
            if (newMsgs.length > 0) {
              lastMessageTime.current = newMsgs[newMsgs.length - 1].createdAt;
              return [...prev, ...newMsgs];
            }
            return prev;
          });
        }
      }
    };

    // Load full history first when switching sessions
    const loadHistory = async () => {
      lastMessageTime.current = null;
      const res = await fetch(`/api/chat/messages?sessionId=${activeSessionId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        if (data.messages.length > 0) {
          lastMessageTime.current = data.messages[data.messages.length - 1].createdAt;
        }
      }
    };

    loadHistory();
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeSessionId || sending) return;
    setSending(true);
    setError(null);

    const res = await fetch("/api/astrologer/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: activeSessionId, content: input.trim() }),
    });

    if (res.ok) {
      const msg = await res.json();
      setMessages(prev => [...prev, msg]);
      lastMessageTime.current = msg.createdAt;
      setInput("");
    } else if (res.status === 422) {
      const data = await res.json();
      setError(data.error);
    } else {
      setError("Failed to send message.");
    }
    setSending(false);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const isClaimedByMe = activeSession?.astrologerUserId === astrologerId;
  const isWaiting = !activeSession?.astrologerUserId;

  const myChats = sessions.filter(s => s.astrologerUserId === astrologerId);
  const waitingRoom = sessions.filter(s => !s.astrologerUserId);

  return (
    <div className="flex h-screen bg-transparent text-foreground">
      {/* Sidebar */}
      <div className={`w-full md:w-72 border-r border-foreground/10 flex-col bg-card/50 backdrop-blur-md ${activeSessionId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 border-b border-foreground/10">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-3">
              <NotificationBell />
              <button onClick={async () => await signOut({ callbackUrl: '/' })} className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
          <div className="mt-3 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="text-xs text-amber-400 font-medium">{astrologerName}</div>
            <div className="text-[10px] text-muted-foreground">Online & Available</div>
          </div>
        </div>

        <div className="p-3 border-b border-foreground/10 bg-amber-500/5">
          <div className="flex items-center gap-2 px-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <div className="text-xs font-bold text-red-500 uppercase tracking-wider">Waiting Room ({waitingRoom.length})</div>
          </div>
        </div>

        <div className="max-h-[40%] overflow-y-auto p-2 space-y-1 border-b border-foreground/10 bg-black/20">
          {waitingRoom.length === 0 ? (
            <div className="text-center text-muted-foreground/50 text-[11px] p-4">No users waiting</div>
          ) : (
            waitingRoom.map(session => {
              const lastMsg = session.messages[0];
              const isActive = session.id === activeSessionId;
              const isDirectRequest = session.astrologerId === astrologerId;
              
              return (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border relative overflow-hidden group ${
                    isActive
                      ? "bg-red-500/20 border-red-500/40"
                      : "bg-background/40 border-red-500/20 hover:border-red-500/40"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center font-bold text-sm shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                      {session.user.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-red-400 truncate">
                        {session.user.name} 
                        {isDirectRequest && <span className="ml-1 text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">Requested You</span>}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {lastMsg?.content || "Waiting for astrologer..."}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="p-3 border-b border-foreground/10">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">My Active Chats ({myChats.length})</div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {myChats.length === 0 ? (
            <div className="text-center text-muted-foreground/60 text-sm p-6">No active chats claimed</div>
          ) : (
            myChats.map(session => {
              const lastMsg = session.messages[0];
              const isActive = session.id === activeSessionId;
              return (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    isActive
                      ? "bg-amber-500/20 border-amber-500/30"
                      : "border-transparent hover:bg-foreground/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {session.user.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-foreground/90 truncate">{session.user.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {lastMsg?.content || "No messages yet"}
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground/80 whitespace-nowrap">
                      {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex-col ${!activeSessionId ? 'hidden md:flex' : 'flex'}`}>
        {!activeSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <MessageCircle className="w-16 h-16 text-foreground/10 mb-4" />
            <h2 className="text-xl font-bold text-muted-foreground/80">Select a Client Chat</h2>
            <p className="text-muted-foreground/60 mt-2 text-sm">Choose a conversation from the left panel to start helping a client</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-foreground/10 bg-card/30 backdrop-blur-md">
              <button 
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => setActiveSessionId(null)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold">
                {activeSession?.user.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-foreground flex items-center gap-2">
                  {activeSession?.user.name}
                  {isWaiting && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30">WAITING</span>}
                  {isClaimedByMe && <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30">CLAIMED</span>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {activeSession?.astrologerId ? `Direct Request` : "Open Pool"}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2 text-xs">
                {isWaiting ? (
                  <span className="flex items-center gap-1 text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" /> Action Required
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(msg => {
                const isClientMsg = msg.role === "user";  // client's message â†’ show on LEFT
                const isAI = msg.senderRole === "AI";
                const isMe = msg.senderRole === "ASTROLOGER"; // my reply â†’ show on RIGHT
                return (
                  <div key={msg.id} className={`flex ${isClientMsg ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                      isClientMsg
                        ? "bg-foreground/10 text-foreground rounded-tl-none"
                        : isAI
                        ? "bg-indigo-500/20 border border-indigo-500/30 text-foreground/90 rounded-tr-none"
                        : "bg-amber-500/20 border border-amber-500/40 text-foreground rounded-tr-none"
                    }`}>
                      {!isClientMsg && (
                        <div className={`text-[10px] font-semibold mb-1 ${isAI ? "text-indigo-400" : "text-amber-400"}`}>
                          {isAI ? "🤖 AI Response" : "✨ You (Astrologer)"}
                        </div>
                      )}
                      {isClientMsg && (
                        <div className="text-[10px] font-semibold mb-1 text-muted-foreground">
                          👤 {activeSession?.user?.name || "Client"}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Error notice */}
            {error && (
              <div className="mx-6 mb-2 p-3 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Input / Action Area */}
            {isWaiting ? (
              <div className="p-6 border-t border-foreground/10 bg-card/30 backdrop-blur-md text-center">
                <div className="inline-flex flex-col items-center">
                  <p className="text-muted-foreground mb-4 text-sm">This user is waiting for an astrologer. Claim this chat to start helping them.</p>
                  <textarea
                    value={input}
                    onChange={e => { setInput(e.target.value); setError(null); }}
                    placeholder="Type your first message to claim this chat..."
                    rows={2}
                    className="w-full max-w-lg mb-4 bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder-white/30 resize-none focus:outline-none focus:border-amber-500/50 text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !input.trim()}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                  >
                    <Zap className="w-5 h-5" />
                    {sending ? "Claiming..." : "Claim & Reply to User"}
                  </button>
                </div>
              </div>
            ) : isClaimedByMe ? (
              <div className="p-4 border-t border-foreground/10 bg-card/30 backdrop-blur-md">
                <div className="flex gap-3 items-end">
                  <textarea
                    value={input}
                    onChange={e => { setInput(e.target.value); setError(null); }}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Type your reply to the client..."
                    rows={2}
                    className="flex-1 bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder-white/30 resize-none focus:outline-none focus:border-amber-500/50 text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !input.trim()}
                    className="w-11 h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 rounded-xl flex items-center justify-center transition-colors shadow-lg"
                  >
                    <Send className="w-5 h-5 text-black" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">⚠️ Phone numbers are not allowed in messages</p>
              </div>
            ) : (
              <div className="p-6 border-t border-foreground/10 bg-card/30 backdrop-blur-md text-center">
                <p className="text-muted-foreground text-sm">This chat has been claimed by another astrologer.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

