"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Chip } from "@/components/ui/Chip";
import { Phone, Globe, Heart, MapPin } from "lucide-react";

interface Hotline {
  name: string;
  number: string;
  text: string;
}

interface Grant {
  id: string;
  name: string;
  description: string;
  amount: string;
  coverage: string;
  featured: boolean;
  rolling: boolean;
  tags: string[];
}

export default function ResourcesPage() {
  const [locale, setLocale] = useState("US");
  const [hotline, setHotline] = useState<Hotline | null>(null);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/resources?need=hotline&locale=${locale}`).then((r) => r.json()),
      fetch(`/api/resources?need=sponsor&locale=${locale}`).then((r) => r.json()),
    ])
      .then(([hotlineRes, grantsRes]) => {
        setHotline(hotlineRes.data || null);
        setGrants(grantsRes.data || []);
      })
      .catch((err) => {
        console.error("Failed to load resources:", err);
      })
      .finally(() => setLoading(false));
  }, [locale]);

  return (
    <div className="max-w-5xl mx-auto space-y-section-gap">
      <section className="text-center">
        <MapPin className="mx-auto text-primary mb-3" size={36} />
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Finding Your Path</h2>
        <p className="font-body-lg text-body-md text-on-surface-variant mt-2">
          Access immediate support channels and community-funded grants designed to nurture your growth.
        </p>
      </section>

      <div className="flex justify-end">
        <label className="flex items-center gap-2 text-sm text-on-surface-variant">
          Region:
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="bg-surface-container/50 border border-white/10 rounded-full px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none"
          >
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
          </select>
        </label>
      </div>

      {loading ? (
        <div className="text-center text-on-surface-variant animate-pulse">Loading resources...</div>
      ) : (
        <>
          <section>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
              <Phone size={20} className="text-primary" /> Immediate Support
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotline ? (
                <GlassCard className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-label-sm text-label-sm">
                        {locale}
                      </span>
                      <Phone size={18} className="text-on-surface-variant/60" />
                    </div>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-1">{hotline.name}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">{hotline.text}</p>
                  </div>
                  <a
                    href={`tel:${hotline.number.replace(/\s/g, "")}`}
                    className="mt-4 inline-flex items-center justify-center gap-2 w-full rounded-full py-3 bg-primary text-on-primary font-headline-md text-sm font-medium transition-all hover:shadow-[0_0_20px_rgba(78,222,163,0.3)] active:scale-95"
                  >
                    <Phone size={16} /> Call {hotline.number}
                  </a>
                </GlassCard>
              ) : (
                <div className="text-on-surface-variant">No hotline available.</div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <Heart size={20} className="text-primary" /> Grants & Funding
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {grants.map((grant) => (
                <GlassCard key={grant.id} className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-secondary-container/30 text-secondary px-2 py-1 rounded-full font-label-sm text-label-sm">
                      {grant.rolling ? "Rolling" : grant.featured ? "Featured" : "Grant"}
                    </span>
                    <Globe size={18} className="text-on-surface-variant/60" />
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-2">{grant.name}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow">
                    {grant.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {grant.tags.map((tag) => (
                      <Chip key={tag}>{tag}</Chip>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Up to</p>
                      <p className="font-display-lg text-display-lg text-primary text-2xl">{grant.amount}</p>
                    </div>
                    <button className="bg-primary text-on-primary px-5 py-2 rounded-full font-headline-md text-sm font-medium active:scale-95 transition-transform">
                      Apply
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
