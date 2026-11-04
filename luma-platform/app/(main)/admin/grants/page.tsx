"use client";

import { useState } from "react";
import { Trash2, Edit, Plus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ErrorAlert } from "@/components/ui/Feedback";
import { Input, Textarea } from "@/components/ui/Field";
import { useAdminCollection } from "@/lib/admin-client";
import type { Grant } from "@/lib/types";

const EMPTY_FORM = {
  name: "",
  description: "",
  amount: "",
  coverage: "",
  featured: false,
  rolling: false,
  tags: "",
};

const splitTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

export default function AdminGrantsPage() {
  const {
    items: grants,
    loading,
    error,
    mutate,
  } = useAdminCollection<Grant>("/api/admin/grants", "Could not load grants.");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Grant | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const saved = await mutate({
      method: editing ? "PATCH" : "POST",
      body: { ...form, id: editing?.id, tags: splitTags(form.tags) },
    });
    if (saved) resetForm();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this grant?")) return;
    await mutate({ method: "DELETE", query: `?id=${id}` });
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

  return (
    <AdminPage
      title="Manage Grants"
      description="Add, edit, and remove community grants and funding."
      loading={loading}
      loadingText="Loading grants..."
    >
      <GlassCard className="p-6 mb-8">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
          {editing ? "Edit Grant" : "Add Grant"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Grant name"
            required
          />
          <Input
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="Amount (e.g. Up to $5,000)"
            required
          />
          <Input
            value={form.coverage}
            onChange={(e) => setForm({ ...form, coverage: e.target.value })}
            placeholder="Coverage (e.g. US, Global)"
            required
          />
          <Input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Tags (comma separated)"
          />
          <div className="md:col-span-2">
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="min-h-[100px]"
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
              {saving
                ? editing
                  ? "Updating..."
                  : "Adding..."
                : editing
                  ? "Update Grant"
                  : "Add Grant"}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
                Cancel
              </Button>
            )}
          </div>
        </form>
        <ErrorAlert message={error} className="mt-4" />
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
              <h4 className="font-headline-md text-headline-md text-on-surface mb-1">
                {grant.name}
              </h4>
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
    </AdminPage>
  );
}
