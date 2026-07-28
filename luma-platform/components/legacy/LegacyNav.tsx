"use client";

import Link from "next/link";

interface Variant {
  label: string;
  href: string;
}

interface LegacyNavProps {
  title: string;
  variants: Variant[];
}

export function LegacyNav({ title, variants }: LegacyNavProps) {
  return (
    <div className="mt-8 pt-8 border-t border-white/10">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-4">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {variants.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="inline-flex items-center rounded-full px-4 py-2 bg-surface-container/50 border border-white/10 text-sm text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors active:scale-95"
          >
            {v.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
