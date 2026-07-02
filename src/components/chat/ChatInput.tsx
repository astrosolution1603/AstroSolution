import { useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((input || "").trim() && !isLoading) {
        e.currentTarget.form?.requestSubmit();
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-end bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 rounded-2xl p-2 transition-all focus-within:border-amber-500/50 shadow-sm dark:shadow-none"
    >
      <button 
        type="button"
        aria-label="Voice input"
        className="p-3 text-slate-400 dark:text-white/50 hover:text-slate-600 dark:hover:text-white transition-colors"
        disabled={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
      </button>
      
      <textarea
        ref={textareaRef}
        value={input || ""}
        onChange={handleInput}
        onKeyDown={onKeyDown}
        placeholder="Ask about your destiny, career, love..."
        className="flex-grow bg-transparent border-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:ring-0 resize-none py-3 px-2 max-h-[120px] outline-none min-h-[44px]"
        rows={1}
        disabled={isLoading}
      />
      
      <Button 
        type="submit" 
        aria-label="Send message"
        disabled={isLoading || !(input || "").trim()}
        size="icon"
        className="mb-0.5 ml-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl h-10 w-10 flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
      </Button>
    </form>
  );
}
