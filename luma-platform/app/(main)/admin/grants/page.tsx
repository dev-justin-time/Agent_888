"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AdminNav } from "@/components/admin/AdminNav";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Heart, Trash2, Edit, Plus, AlertCircle } from "lucide-react";

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

export default function AdminGrantsPage() {
  const { data: session, status } = useSession();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Grant | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    amount: "",
    coverage: "",
    featured: false,
    rolling: false,
    tags: "",
  });

  const fetchGrants = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/grants");
      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        setGrants(data.data);
      } else {
        setError("Could not load grants.");
      }
    } catch {
      setError("Could not load grants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrants();
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", amount: "", coverage: "", featured: false, rolling: false, tags: "" });
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...form,
      id: editing?.id,
      tags: form.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/grants", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === "success") {
        resetForm();
        await fetchGrants();
      } else {
        setError(data.message || "Could not save grant.");
      }
    } catch {
      setError("Could not save grant.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this grant?")) return;
    try {
      const res = await fetch(`/api/admin/grants?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        await fetchGrants();
      } else {
        setError(data.message || "Could not delete grant.");
      }
    } catch {
      setError("Could not delete grant.");
    }
  };

  const startEdit = (grant: Grant) => {
    setEditing(grant);
    setForm({
      name: grant.name,
      description: grant.description,
      amount: grant.amount,
      coverage: grant.coverage,
      featured: grant.featured,
      rolling: grant.rolling,
      tags: grant.tags.join(", "),
    });
  };

  if (status === "loading" || loading) {
    return <div className="text-center text-on-surface-variant animate-pulse py-12">Loading grants...</div>;
  }

  if (!session || session.user?.role !== "ADMIN") {
    return <div className="text-center text-error py-12">You do not have permission to view this page.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader title="Manage Grants" description="Add, edit, and remove community grants and funding." />
      <AdminNav />

      <GlassCard className="p-6 mb-8">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
          {editing ? "Edit Grant" : "Add Grant"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Grant name"
            className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
            required
          />
          <input
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="Amount (e.g. Up to $5,000)"
            className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
            required
          />
          <input
            value={form.coverage}
            onChange={(e) => setForm({ ...form, coverage: e.target.value })}
            placeholder="Coverage (e.g. US, Global)"
            className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
            required
          />
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Tags (comma separated)"
            className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
          />
          <div className="md:col-span-2">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none min-h-[100px]"
              required
            />
          </div>
          <div className="flex items-center gap-4 md:col-span-2">
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-primary"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                checked={form.rolling}
                onChange={(e) => setForm({ ...form, rolling: e.target.checked })}
                className="accent-primary"
              />
              Rolling
            </label>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" disabled={saving} className="flex items-center gap-2">
              {editing ? <Edit size={16} /> : <Plus size={16} />}
              {saving ? (editing ? "Updating..." : "Adding...") : editing ? "Update Grant" : "Add Grant"}
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
        {grants.map((grant) => (
          <GlassCard key={grant.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2">
                  {grant.featured && <Chip active>Featured</Chip>}
                  {grant.rolling && <Chip>Rolling</Chip>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(grant)}
                    className="p-2 rounded-full hover:bg-surface-container-high text-primary transition-colors"
                    aria-label="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(grant.id)}
                    className="p-2 rounded-full hover:bg-error/10 text-error transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-1">{grant.name}</h4>
              <p className="text-primary font-display-lg text-xl mb-2">{grant.amount}</p>
              <p className="text-on-surface-variant text-body-md mb-3">{grant.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {grant.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
              <p className="text-on-surface-variant text-sm">Coverage: {grant.coverage}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
