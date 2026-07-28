"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

const PROVIDER_TYPES = ["navigator", "counselor", "peer"];

export default function ProviderApplyPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [type, setType] = useState("navigator");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; status: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/provider/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          cost,
          description,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ message: data.message || "Application submitted!", status: "success" });
      } else {
        setResult({ message: data.message || "Something went wrong.", status: "error" });
      }
    } catch {
      setResult({ message: "Network error. Please try again.", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="text-center text-on-surface-variant animate-pulse">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto pt-12 text-center">
        <GlassCard className="p-8">
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold mb-4">Provider Onboarding</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Please sign in to apply as a verified provider.
          </p>
          <Link href="/sign-in">
            <Button className="w-full">Sign In</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-primary font-bold mb-2">Provider Application</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-6">
        Submit your details for verification. Applications are reviewed by our team.
      </p>

      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-on-surface-variant">Signed in as {session.user.email}</p>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-primary hover:underline">
            Sign out
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Provider / organization name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none"
          >
            {PROVIDER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Cost / sliding scale (e.g. Pro Bono, $25/session)"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
            required
          />
          <textarea
            placeholder="Description of your practice or community"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none min-h-[120px]"
            required
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
          />
          {result && (
            <p className={result.status === "success" ? "text-primary text-sm" : "text-error text-sm"}>
              {result.message}
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
