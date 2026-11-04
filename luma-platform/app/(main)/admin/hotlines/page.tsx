"use client";

import { useState } from "react";
import { Phone, Trash2, Edit, Plus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ErrorAlert } from "@/components/ui/Feedback";
import { Input } from "@/components/ui/Field";
import { useAdminCollection } from "@/lib/admin-client";
import type { Hotline } from "@/lib/types";

const EMPTY_FORM = { locale: "", name: "", number: "", text: "" };

export default function AdminHotlinesPage() {
  const {
    items: hotlines,
    loading,
    error,
    mutate,
  } = useAdminCollection<Hotline>("/api/admin/hotlines", "Could not load hotlines.");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Hotline | null>(null);
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
      body: { ...form, id: editing?.id },
    });
    if (saved) resetForm();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hotline?")) return;
    await mutate({ method: "DELETE", query: `?id=${id}` });
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

  return (
    <AdminPage
      title="Manage Hotlines"
      description="Add, edit, and remove support hotlines by region."
      loading={loading}
      loadingText="Loading hotlines..."
    >
      <GlassCard className="p-6 mb-8">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
          {editing ? "Edit Hotline" : "Add Hotline"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={form.locale}
            onChange={(e) => setForm({ ...form, locale: e.target.value })}
            placeholder="Locale (e.g. US)"
            required
          />
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Hotline name"
            required
          />
          <Input
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            placeholder="Phone number"
            required
          />
          <Input
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Short description"
            required
          />
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" disabled={saving} className="flex items-center gap-2">
              {editing ? <Edit size={16} /> : <Plus size={16} />}
              {saving
                ? editing
                  ? "Updating..."
                  : "Adding..."
                : editing
                  ? "Update Hotline"
                  : "Add Hotline"}
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
              <h4 className="font-headline-md text-headline-md text-on-surface mb-1">
                {hotline.name}
              </h4>
              <p className="text-on-surface-variant text-body-md flex items-center gap-2">
                <Phone size={16} />
                {hotline.number}
              </p>
              <p className="text-on-surface-variant text-sm mt-2">{hotline.text}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </AdminPage>
  );
}
