import { notFound } from "next/navigation";
import { readLegacyHtml } from "@/lib/legacy";

const VALID_SECTIONS = ["navigate", "resources", "community", "stewardship"];

interface LegacyRouteProps {
  params: {
    section: string;
    variant: string;
  };
}

export default function LegacyPage({ params }: LegacyRouteProps) {
  if (!VALID_SECTIONS.includes(params.section)) {
    notFound();
  }

  let page: { content: string; title: string };
  try {
    page = readLegacyHtml(params.section, params.variant);
  } catch {
    notFound();
  }

  return (
    <article className="max-w-7xl mx-auto animate-fade-in-up">
      <h1 className="font-headline-lg text-headline-lg text-primary font-bold mb-6">
        {page.title}
      </h1>
      <div
        dangerouslySetInnerHTML={{ __html: page.content }}
        className="legacy-content space-y-6"
      />
    </article>
  );
}

export function generateStaticParams() {
  return [
    { section: "navigate", variant: "empathetic-guidance" },
    { section: "navigate", variant: "immersive-guidance" },
    { section: "navigate", variant: "luma-chat" },
    { section: "resources", variant: "support-grants-1" },
    { section: "resources", variant: "support-grants-2" },
    { section: "community", variant: "shared-resonance" },
    { section: "community", variant: "verified-providers" },
    { section: "community", variant: "deep-earth-variant" },
    { section: "stewardship", variant: "ethical-growth" },
    { section: "stewardship", variant: "partner-tools" },
    { section: "stewardship", variant: "partner-tools-2" },
  ];
}
