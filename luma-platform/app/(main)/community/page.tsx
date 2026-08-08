"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle2, ExternalLink, Users, Search, Filter, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { COMMUNITY_TOP_CALLS } from "@/data/top-calls";
import type { CommunityCall } from "@/data/top-calls";
import type { Provider } from "@/lib/types";

export default function CommunityPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filtered, setFiltered] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [handoff, setHandoff] = useState<{ name: string; url: string } | null>(null);

  const runNeed = (call: CommunityCall) => {
    setSearch(call.search);
    setTypeFilter(call.type);
    document.getElementById("provider-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    fetch("/api/providers")
      .then((res) => res.json())
      .then((json) => {
        const list: Provider[] = json.data || [];
        setProviders(list);
        setFiltered(list);
      });
  }, []);

  useEffect(() => {
    let list = providers;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== "all") {
      list = list.filter((p) => p.type === typeFilter);
    }
    if (verifiedOnly) {
      list = list.filter((p) => p.verified);
    }
    setFiltered(list);
  }, [search, typeFilter, verifiedOnly, providers]);

  const handleConnect = async (provider: Provider) => {
    setConnecting(provider.id);
    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_locale: provider.locale, provider_type: provider.type }),
      });
      const data = await res.json();
      if (data.status === "success" && data.secure_handoff_link) {
        setHandoff({ name: data.provider.name, url: data.secure_handoff_link });
      }
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-section-gap">
      <section className="text-center">
        <Users className="mx-auto text-primary mb-3" size={36} />
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Shared Resonance</h2>
        <p className="font-body-lg text-body-md text-on-surface-variant mt-2">
          Connect with verified professionals and intentional communities beyond our digital borders.
        </p>
      </section>

      <div className="glass-card inner-glow rounded-2xl border border-white/10 p-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant mb-3 flex items-center gap-1.5">
          <Sparkles size={14} className="text-primary" /> Top 50 needs — tap to find a matching provider
        </p>
        <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
          {COMMUNITY_TOP_CALLS.map((call) => (
            <button
              key={call.id}
              onClick={() => runNeed(call)}
              className="text-xs text-left text-primary border border-primary/25 rounded-full px-3 py-1.5 hover:bg-primary/10 hover:border-primary/50 active:scale-95 transition-all"
            >
              {call.question}
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search providers, tags, or descriptions..."
            className="w-full pl-10 pr-4 py-2 bg-surface-container/50 border border-white/10 rounded-full text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-on-surface-variant/60" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-surface-container/50 border border-white/10 rounded-full px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none"
          >
            <option value="all">All types</option>
            <option value="navigator">Navigator</option>
            <option value="counselor">Counselor</option>
            <option value="peer">Peer</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-on-surface-variant whitespace-nowrap cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="accent-primary"
            />
            Verified only
          </label>
        </div>
      </GlassCard>

      <section id="provider-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-24">
        {filtered.map((provider) => (
          <GlassCard key={provider.id} className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                <Shield className="text-primary" size={24} />
              </div>
              {provider.verified && (
                <span className="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-full text-[10px] font-label-sm text-primary uppercase tracking-widest border border-primary/20">
                  <CheckCircle2 size={12} /> Verified
                </span>
              )}
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{provider.name}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow">
              {provider.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {provider.tags.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant/70">{provider.cost}</span>
              <Button onClick={() => handleConnect(provider)} disabled={connecting === provider.id}>
                {connecting === provider.id ? "Connecting..." : "Connect"}
                <ExternalLink size={14} />
              </Button>
            </div>
          </GlassCard>
        ))}
      </section>

      {handoff && (
        <div className="fixed inset-0 z-[60] bg-surface/90 backdrop-blur-xl flex items-center justify-center p-6">
          <GlassCard className="max-w-md w-full p-8 space-y-4">
            <h3 className="font-headline-md text-headline-md text-primary">Secure Handoff</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              You are being connected to <strong>{handoff.name}</strong>. This link opens their secure,
              zero-record booking system.
            </p>
            <a
              href={handoff.url}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center rounded-full py-3 bg-primary text-on-primary font-headline-md text-sm font-medium"
            >
              Continue to provider <ExternalLink size={14} className="inline ml-1" />
            </a>
            <Button variant="outline" onClick={() => setHandoff(null)} className="w-full">
              Close
            </Button>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
