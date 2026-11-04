"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import type { TopCall } from "@/data/top-calls";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface TopQuestionsProps {
  calls: TopCall[];
  /** Fired with the full question text when a chip is clicked. */
  onSelect: (question: string) => void;
  title?: string;
  placeholder?: string;
  /** Number of chips shown before "Show all" is needed (ignored while searching). */
  visible?: number;
  className?: string;
  compact?: boolean;
}

export default function TopQuestions({
  calls,
  onSelect,
  title = "Most common questions",
  placeholder = "Search questions…",
  visible = 10,
  className,
  compact = false,
}: TopQuestionsProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? calls.filter(
        (c) =>
          c.question.toLowerCase().includes(q) ||
          (c.category ?? "").toLowerCase().includes(q)
      )
    : calls;
  const shown = expanded || q ? filtered : filtered.slice(0, visible);

  return (
    <GlassCard hover={false} className={cn(compact ? "p-3" : "p-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-primary shrink-0" />
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          {title}
          <span className="ml-1.5 text-on-surface-variant/50">
            ({calls.length} curated)
          </span>
        </p>
      </div>

      <div className="relative mb-3">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 bg-surface-container/50 border border-white/10 rounded-full text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
        {shown.map((call) => (
          <button
            key={call.id}
            onClick={() => onSelect(call.question)}
            title={call.category}
            className="text-xs text-left text-primary border border-primary/25 rounded-full px-3 py-1.5 hover:bg-primary/10 hover:border-primary/50 active:scale-95 transition-all"
          >
            {call.question}
          </button>
        ))}
        {shown.length === 0 && (
          <p className="text-xs text-on-surface-variant/60 py-1">
            No matches — try different words.
          </p>
        )}
      </div>

      {!q && filtered.length > visible && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 text-xs font-medium text-secondary hover:text-primary transition-colors"
        >
          {expanded
            ? "Show fewer"
            : `Show all ${filtered.length} questions`}
        </button>
      )}
    </GlassCard>
  );
}
