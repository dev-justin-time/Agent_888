"use client";

import Link from "next/link";
import { Sparkles, Shield, Cpu } from "lucide-react";
import { EXPERT_TOPICS } from "@/lib/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExpertIcon } from "@/components/experts/ExpertIcon";

export default function ExpertsPage() {
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

      <section className="flex items-start gap-4 glass-card inner-glow p-6 border-l-4 border-l-primary/50">
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
      </section>
    </div>
  );
}
