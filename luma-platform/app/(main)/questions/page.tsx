"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, ArrowRight, Search, ChevronDown, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExpertIcon } from "@/components/experts/ExpertIcon";
import { EXPERT_TOPICS } from "@/lib/constants";
import {
  TOP_CALLS_BY_EXPERT,
  NAVIGATOR_TOP_CALLS,
  RESOURCES_TOP_CALLS,
  COMMUNITY_TOP_CALLS,
  ESCROW_TOP_CALLS,
  OUTREACH_TOP_CALLS,
} from "@/data/top-calls";
import type { TopCall, ResourceCall, CommunityCall, EscrowCall, OutreachCall } from "@/data/top-calls";
import { cn } from "@/lib/utils";

type Call = TopCall & Partial<ResourceCall & CommunityCall & EscrowCall & OutreachCall>;

interface Library {
  key: string;
  label: string;
  kind: "expert" | "navigator" | "resources" | "community" | "escrow" | "outreach";
  expertId?: string;
  calls: Call[];
}

const EXPERT_LIBRARIES: Library[] = EXPERT_TOPICS.map((t) => ({
  key: t.id,
  label: t.label,
  kind: "expert",
  expertId: t.id,
  calls: TOP_CALLS_BY_EXPERT[t.id] ?? [],
}));

const CORE_LIBRARIES: Library[] = [
  {
    key: "navigator",
    label: "Life Navigator",
    kind: "navigator",
    calls: NAVIGATOR_TOP_CALLS,
  },
  {
    key: "resources",
    label: "Support Resources",
    kind: "resources",
    calls: RESOURCES_TOP_CALLS,
  },
  {
    key: "community",
    label: "Community & Providers",
    kind: "community",
    calls: COMMUNITY_TOP_CALLS,
  },
  {
    key: "escrow",
    label: "Escrow Stewardship",
    kind: "escrow",
    calls: ESCROW_TOP_CALLS,
  },
  {
    key: "outreach",
    label: "Partner Outreach",
    kind: "outreach",
    calls: OUTREACH_TOP_CALLS,
  },
];

const LIBRARIES = [...EXPERT_LIBRARIES, ...CORE_LIBRARIES];
const TOTAL = LIBRARIES.reduce((n, lib) => n + lib.calls.length, 0);

function targetFor(lib: Library, call: Call): string {
  switch (lib.kind) {
    case "expert":
      return `/experts/${lib.expertId}?q=${encodeURIComponent(call.question)}`;
    case "navigator":
      return `/navigate?q=${encodeURIComponent(call.question)}`;
    case "resources":
      return `/resources?need=${call.action === "grants" ? "grants" : "hotline"}`;
    case "community":
      return `/community?search=${encodeURIComponent(call.search ?? "")}&type=${call.type ?? "all"}`;
    case "escrow":
    case "outreach":
      return `/stewardship?run=${call.id}`;
  }
}

function LibraryGroup({
  lib,
  matches,
  onOpen,
}: {
  lib: Library;
  matches: Call[];
  onOpen: (call: Call) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? matches : matches.slice(0, 8);
  const meta = EXPERT_TOPICS.find((t) => t.id === lib.key);

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          {meta ? (
            <ExpertIcon icon={meta.icon} className="text-primary" size={20} />
          ) : (
            <BookOpen className="text-primary" size={20} />
          )}
        </span>
        <div className="min-w-0">
          <h3 className="font-headline-md text-headline-md text-on-surface truncate">
            {lib.label}
          </h3>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {lib.calls.length} curated questions
          </p>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {shown.map((call) => (
          <button
            key={call.id}
            onClick={() => onOpen(call)}
            className="w-full flex items-center justify-between gap-3 text-left px-3 py-2.5 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-colors group"
          >
            <span className="text-sm text-on-surface leading-snug">{call.question}</span>
            <ArrowRight
              size={14}
              className="text-on-surface-variant/40 group-hover:text-primary shrink-0 transition-colors"
            />
          </button>
        ))}
      </div>

      {matches.length > 8 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-primary transition-colors"
        >
          <ChevronDown className={cn("transition-transform", expanded && "rotate-180")} size={14} />
          {expanded ? "Show fewer" : `Show all ${matches.length} matches`}
        </button>
      )}
    </GlassCard>
  );
}

export default function QuestionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [active, setActive] = useState<string>("all");

  const q = query.trim().toLowerCase();
  const groups = useMemo(() => {
    return LIBRARIES.filter((lib) => active === "all" || lib.key === active)
      .map((lib) => {
        const filtered = q
          ? lib.calls.filter(
              (c) =>
                c.question.toLowerCase().includes(q) ||
                (c.category ?? "").toLowerCase().includes(q)
            )
          : lib.calls;
        return { lib, matches: filtered };
      })
      .filter((g) => g.matches.length > 0);
  }, [q, active]);

  const matchedCount = groups.reduce((n, g) => n + g.matches.length, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-section-gap">
      <section className="text-center">
        <BookOpen className="mx-auto text-primary mb-3" size={36} />
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
          Question Library
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl mx-auto">
          {TOTAL} most common questions across every Luma agent — search them all in one
          place, then jump straight into the right guide.
        </p>
      </section>

      {/* Search + stats */}
      <GlassCard hover={false} className="p-4 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.replace(`/questions?q=${encodeURIComponent(query)}`, { scroll: false });
          }}
          className="relative"
        >
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all questions — try 'eviction', 'STAR method', 'gift card scam', 'overwhelmed'…"
            className="w-full pl-11 pr-4 py-3 bg-surface-container/50 border border-white/10 rounded-full text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActive("all")}
            className={cn(
              "text-xs rounded-full px-3 py-1.5 border transition-colors",
              active === "all"
                ? "bg-primary/20 text-primary border-primary/40"
                : "border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/30"
            )}
          >
            All ({TOTAL})
          </button>
          {LIBRARIES.map((lib) => (
            <button
              key={lib.key}
              onClick={() => setActive(active === lib.key ? "all" : lib.key)}
              className={cn(
                "text-xs rounded-full px-3 py-1.5 border transition-colors",
                active === lib.key
                  ? "bg-primary/20 text-primary border-primary/40"
                  : "border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/30"
              )}
            >
              {lib.label}
            </button>
          ))}
        </div>

        <p className="flex items-center gap-1.5 text-xs text-on-surface-variant/70">
          <Sparkles size={12} className="text-primary" />
          {q
            ? `${matchedCount} match${matchedCount === 1 ? "" : "es"} across ${groups.length} agent${groups.length === 1 ? "" : "s"}`
            : `${TOTAL} curated questions · ${LIBRARIES.length} agents`}
        </p>
      </GlassCard>

      {/* Results */}
      {groups.length > 0 ? (
        <section className="space-y-6">
          {groups.map(({ lib, matches }) => (
            <LibraryGroup
              key={lib.key}
              lib={lib}
              matches={matches}
              onOpen={(call) => router.push(targetFor(lib, call))}
            />
          ))}
        </section>
      ) : (
        <div className="text-center py-12 text-on-surface-variant">
          <Search className="mx-auto mb-3 opacity-40" size={32} />
          <p className="font-body-md text-body-md">
            No questions match “{query}”. Try different words — or ask any guide directly.
          </p>
        </div>
      )}
    </div>
  );
}
