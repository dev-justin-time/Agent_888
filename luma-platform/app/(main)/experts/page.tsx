"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, Cpu, Search, ArrowRight } from "lucide-react";
import { EXPERT_TOPICS } from "@/lib/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import { SearchInput } from "@/components/ui/Field";
import { ExpertIcon } from "@/components/experts/ExpertIcon";

const QUICK_SEARCHES = [
  "50/30/20 budget",
  "negotiate salary",
  "phishing link",
  "STAR method",
  "overwhelmed",
  "security deposit",
];

export default function ExpertsPage() {
  const router = useRouter();
  const [quick, setQuick] = useState("");

  return (
    <div className="max-w-5xl mx-auto space-y-section-gap">
      <section className="text-center">
        <Sparkles className="mx-auto text-primary mb-3" size={36} />
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
          Expert Guidance
        </h2>
        <p className="font-body-lg text-body-md text-on-surface-variant mt-2 max-w-2xl mx-auto">
          Plain-language practical logic for life&apos;s decisions — money, rights, career,
          learning, home admin, digital safety, and headspace. Every expert runs on built-in
          evidence-based frameworks, stays completely anonymous, and never records a word.
        </p>
      </section>

      {/* Question Library — search all 600 curated questions */}
      <GlassCard hover={false} className="p-6 border-l-4 border-l-primary/50">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
              <Search className="text-primary" size={24} />
            </span>
            <div>
              <h3 className="font-headline-md text-headline-md text-primary font-semibold">
                Question Library
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                600 most common questions across every expert — search them all in one place.
              </p>
            </div>
          </div>
          <Link
            href="/questions"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/30 rounded-full px-4 py-2 hover:bg-primary/10 active:scale-95 transition-all"
          >
            Browse all <ArrowRight size={14} />
          </Link>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/questions?q=${encodeURIComponent(quick)}`);
          }}
          className="mt-4"
        >
          <SearchInput
            iconClassName="left-4"
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            placeholder="Search 600 questions — e.g. eviction, STAR method, gift card scam…"
            className="pl-10 py-2.5 text-sm"
          />
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_SEARCHES.map((term) => (
            <Link
              key={term}
              href={`/questions?q=${encodeURIComponent(term)}`}
              className="text-xs text-secondary border border-secondary/25 rounded-full px-3 py-1 hover:bg-secondary/10 active:scale-95 transition-all"
            >
              {term}
            </Link>
          ))}
        </div>
      </GlassCard>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EXPERT_TOPICS.map((topic) => (
          <Link key={topic.id} href={`/experts/${topic.id}`} className="group">
            <GlassCard className="p-6 h-full transition-transform group-hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 transition-shadow group-hover:shadow-[0_0_20px_rgba(78,222,163,0.25)]">
                  <ExpertIcon icon={topic.icon} className="text-primary" size={24} />
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  {topic.label}
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                {topic.tagline}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider">
                  <Cpu size={11} /> Built-in logic
                </span>
                <span className="inline-flex items-center gap-1 bg-secondary-container/30 text-secondary px-2 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider">
                  <Shield size={11} /> Anonymous
                </span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </section>

      <GlassCard
        as="section"
        shape="square"
        hover={false}
        className="flex items-start gap-4 p-6 border-l-4 border-l-primary/50"
      >
        <Shield className="text-primary flex-shrink-0 mt-1" size={24} />
        <div>
          <h4 className="font-headline-md text-headline-md text-on-surface mb-2">
            Real frameworks, real safeguards
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Each expert matches your question against curated, evidence-based frameworks
            (like 50/30/20 budgeting, the STAR method, or the 5-4-3-2-1 grounding
            technique), then answers in plain language. Safety rails run first: urgent
            signals always route to human hotlines, and financial, legal, or professional
            needs point you to the resources page. No advice here replaces a qualified
            human for serious matters.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
