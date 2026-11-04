"use client";

import { useState } from "react";
import { Check, X, FileText } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ErrorAlert } from "@/components/ui/Feedback";
import { useAdminCollection } from "@/lib/admin-client";
import type { ApplicationStatus, ProviderApplication } from "@/lib/types";

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;
type Filter = (typeof FILTERS)[number];

export default function AdminApplicationsPage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const endpoint =
    filter === "ALL" ? "/api/admin/applications" : `/api/admin/applications?status=${filter}`;
  const {
    items: applications,
    loading,
    error,
    mutate,
  } = useAdminCollection<ProviderApplication>(endpoint, "Could not load applications.");

  const updateStatus = async (id: string, status: Extract<ApplicationStatus, "APPROVED" | "REJECTED">) => {
    setUpdatingId(id);
    await mutate({ method: "PATCH", body: { id, status } });
    setUpdatingId(null);
  };

  return (
    <AdminPage
      title="Review Applications"
      description="Approve or reject provider applications. Approving creates a public provider listing."
      loading={loading}
      loadingText="Loading applications..."
    >
      <ErrorAlert message={error} className="mb-4" />

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              filter === f
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-surface-container/50 border-white/10 text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {applications.length === 0 && (
          <p className="text-on-surface-variant text-center py-12">No applications found.</p>
        )}
        {applications.map((application) => (
          <GlassCard key={application.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={18} className="text-primary" />
                  <h4 className="font-headline-md text-headline-md text-on-surface">
                    {application.name}
                  </h4>
                  <Chip active={application.status === "PENDING"}>{application.status}</Chip>
                </div>
                <p className="text-on-surface-variant text-sm mb-1">
                  <span className="text-primary">Type:</span> {application.type}
                </p>
                <p className="text-on-surface-variant text-sm mb-2">
                  <span className="text-primary">Cost:</span> {application.cost}
                </p>
                <p className="text-on-surface-variant text-body-md mb-3">
                  {application.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {application.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
                {application.user?.email && (
                  <p className="text-on-surface-variant text-xs mt-2">
                    Applicant: {application.user.email}
                  </p>
                )}
              </div>
              {application.status === "PENDING" && (
                <div className="flex gap-2 shrink-0">
                  <Button
                    onClick={() => updateStatus(application.id, "APPROVED")}
                    disabled={updatingId === application.id}
                    className="flex items-center gap-2"
                  >
                    <Check size={16} /> Approve
                  </Button>
                  <Button
                    onClick={() => updateStatus(application.id, "REJECTED")}
                    disabled={updatingId === application.id}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <X size={16} /> Reject
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </AdminPage>
  );
}
