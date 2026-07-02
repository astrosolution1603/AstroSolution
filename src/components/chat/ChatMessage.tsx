import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
    senderRole?: string;
    createdAt?: Date | string;
  };
  avatar?: string;
}

export default function ChatMessage({ message, avatar = "🔮" }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAstrologer = message.senderRole === "ASTROLOGER";


  return (
    <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[85%] rounded-2xl p-4",
        isUser
          ? "bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 text-slate-800 dark:text-white rounded-tr-sm shadow-sm dark:shadow-none"
          : isAstrologer
          ? "bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-slate-800 dark:text-white/90 rounded-tl-sm flex gap-3 shadow-sm dark:shadow-none"
          : "bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white/90 rounded-tl-sm flex gap-3 shadow-sm dark:shadow-none"
      )}>
        {!isUser && (
          <div className="flex-shrink-0 mt-1">
            <span className="text-xl">{isAstrologer ? "🧑‍💼" : avatar}</span>
          </div>
        )}
        <div className="overflow-hidden min-w-0 flex-1">
          {!isUser && isAstrologer && (
            <div className="text-[10px] font-semibold text-green-400 mb-1">✅ Live Astrologer</div>
          )}

          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="text-sm leading-relaxed prose prose-slate dark:prose-invert prose-sm max-w-none
              prose-headings:text-amber-600 dark:prose-headings:text-amber-300 prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-3
              prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
              prose-p:text-slate-700 dark:prose-p:text-white/90 prose-p:mb-2 prose-p:mt-0
              prose-strong:text-amber-700 dark:prose-strong:text-amber-200 prose-strong:font-semibold
              prose-ul:my-2 prose-ul:pl-4 prose-li:text-slate-700 dark:prose-li:text-white/80 prose-li:my-0.5
              prose-ol:my-2 prose-ol:pl-4
              prose-table:text-xs prose-table:w-full
              prose-th:text-amber-700 dark:prose-th:text-amber-300 prose-th:font-semibold prose-th:p-2 prose-th:border prose-th:border-slate-200 dark:prose-th:border-white/20 prose-th:text-left
              prose-td:p-2 prose-td:border prose-td:border-slate-200 dark:prose-td:border-white/10 prose-td:text-slate-700 dark:prose-td:text-white/80
              prose-tr:border-slate-200 dark:prose-tr:border-white/10
              prose-blockquote:border-amber-500/50 prose-blockquote:text-slate-500 dark:prose-blockquote:text-white/70 prose-blockquote:italic
              prose-code:text-amber-700 dark:prose-code:text-amber-300 prose-code:bg-amber-50 dark:prose-code:bg-black/30 prose-code:px-1 prose-code:rounded
              prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          {message.createdAt && (
            <div className={cn(
              "text-[10px] mt-2 opacity-50",
              isUser ? "text-right" : "text-left"
            )}>
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
