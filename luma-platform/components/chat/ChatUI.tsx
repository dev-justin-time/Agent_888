import { useEffect, useRef } from "react";
import type { DependencyList, ReactNode } from "react";
import { Heart, Send } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

/**
 * The chat surface shared by the Navigate page and the per-expert pages.
 * Both used to hand-write the same bubble, typing indicator, prompt chips,
 * composer, and scroll-to-end ref.
 */

export type ChatBubbleRole = "user" | "assistant";

/** One message bubble. User bubbles align right; assistant bubbles carry the Luma heart. */
export function MessageBubble({
  role,
  text,
  urgent = false,
}: {
  role: ChatBubbleRole;
  text: string;
  urgent?: boolean;
}) {
  const isUser = role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] p-4 text-sm leading-relaxed whitespace-pre-wrap shadow-xl",
          isUser
            ? "bg-primary/20 text-primary rounded-[24px_24px_4px_24px] border border-primary/30"
            : urgent
              ? "bg-error/15 text-error border border-error/40 rounded-[24px_24px_24px_4px]"
              : "glass-card inner-glow chat-bubble-luma text-on-surface"
        )}
      >
        {!isUser && <Heart size={14} className="text-pink-400 inline mr-2 mb-1" />}
        {text}
      </div>
    </div>
  );
}

/** Three staggered bouncing dots while a reply is in flight. */
export function TypingBubble() {
  return (
    <div className="flex justify-start">
      <GlassCard hover={false} className="p-4 rounded-bl-none border border-white/10 flex gap-1">
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </GlassCard>
    </div>
  );
}

/** Suggested-question pills. `children` appends page-specific actions to the same row. */
export function PromptChips({
  prompts,
  onSelect,
  children,
}: {
  prompts: string[];
  onSelect: (prompt: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="text-xs font-label-sm text-primary border border-primary/30 rounded-full px-3 py-1 hover:bg-primary/10 transition-colors text-left"
        >
          {prompt}
        </button>
      ))}
      {children}
    </div>
  );
}

/** The glass message bar with its gradient send button. */
export function ChatComposer({
  value,
  onChange,
  onSubmit,
  placeholder,
  busy = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  busy?: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mt-4 glass-card inner-glow rounded-full px-4 py-3 flex items-center gap-3 border border-white/10"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 font-body-md"
      />
      <button
        type="submit"
        disabled={!value.trim() || busy}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-inverse-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-90 transition-all disabled:opacity-50"
      >
        <Send size={18} />
      </button>
    </form>
  );
}

/** Keeps the transcript pinned to the bottom; pass the state slices that should scroll it. */
export function useAutoScroll(deps: DependencyList) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    // Callers pass exactly the state that should trigger a scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
