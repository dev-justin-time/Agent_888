"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AdminNav } from "@/components/admin/AdminNav";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Phone, Trash2, Edit, Plus, AlertCircle } from "lucide-react";

interface Hotline {
  id: string;
  locale: string;
  name: string;
  number: string;
  text: string;
}

export default function AdminHotlinesPage() {
  const { data: session, status } = useSession();
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Hotline | null>(null);
  const [form, setForm] = useState({ locale: "", name: "", number: "", text: "" });

  const fetchHotlines = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hotlines");
      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        setHotlines(data.data);
      } else {
        setError("Could not load hotlines.");
      }
    } catch {
      setError("Could not load hotlines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotlines();
  }, []);

  const resetForm = () => {
    setForm({ locale: "", name: "", number: "", text: "" });
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/hotlines", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editing?.id }),
      });

      const data = await res.json();
      if (data.status === "success") {
        resetForm();
        await fetchHotlines();
      } else {
        setError(data.message || "Could not save hotline.");
      }
    } catch {
      setError("Could not save hotline.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hotline?")) return;
    try {
      const res = await fetch(`/api/admin/hotlines?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        await fetchHotlines();
      } else {
        setError(data.message || "Could not delete hotline.");
      }
    } catch {
      setError("Could not delete hotline.");
    }
  };

  const startEdit = (hotline: Hotline) => {
    setEditing(hotline);
    setForm({
      locale: hotline.locale,
      name: hotline.name,
      number: hotline.number,
      text: hotline.text,
    });
  };

  if (status === "loading" || loading) {
    return <div className="text-center text-on-surface-variant animate-pulse py-12">Loading hotlines...</div>;
  }

  if (!session || session.user?.role !== "ADMIN") {
    return <div className="text-center text-error py-12">You do not have permission to view this page.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader title="Manage Hotlines" description="Add, edit, and remove support hotlines by region." />
      <AdminNav />

      <GlassCard className="p-6 mb-8">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
          {editing ? "Edit Hotline" : "Add Hotline"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.locale}
            onChange={(e) => setForm({ ...form, locale: e.target.value })}
            placeholder="Locale (e.g. US)"
            className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
            required
          />
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Hotline name"
            className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
            required
          />
          <input
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            placeholder="Phone number"
            className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
            required
          />
          <input
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Short description"
            className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
            required
          />
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" disabled={saving} className="flex items-center gap-2">
              {editing ? <Edit size={16} /> : <Plus size={16} />}
              {saving ? (editing ? "Updating..." : "Adding...") : editing ? "Update Hotline" : "Add Hotline"}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
                Cancel
              </Button>
            )}
          </div>
        </form>
        {error && (
          <div className="mt-4 flex items-center gap-2 text-error text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotlines.map((hotline) => (
          <GlassCard key={hotline.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-label-sm text-label-sm">
                  {hotline.locale}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(hotline)}
                    className="p-2 rounded-full hover:bg-surface-container-high text-primary transition-colors"
                    aria-label="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(hotline.id)}
                    className="p-2 rounded-full hover:bg-error/10 text-error transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-1">{hotline.name}</h4>
              <p className="text-on-surface-variant text-body-md flex items-center gap-2">
                <Phone size={16} />
                {hotline.number}
              </p>
              <p className="text-on-surface-variant text-sm mt-2">{hotline.text}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
