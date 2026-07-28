"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AdminNav } from "@/components/admin/AdminNav";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Check, X, FileText, AlertCircle } from "lucide-react";

interface ProviderApplication {
  id: string;
  userId: string;
  name: string;
  type: string;
  cost: string;
  description: string;
  tags: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user?: { email: string };
}

export default function AdminApplicationsPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filter === "ALL" ? "/api/admin/applications" : `/api/admin/applications?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        setApplications(data.data);
      } else {
        setError("Could not load applications.");
      }
    } catch {
      setError("Could not load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const updateStatus = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setUpdatingId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (data.status === "success") {
        await fetchApplications();
      } else {
        setError(data.message || "Could not update application.");
      }
    } catch {
      setError("Could not update application.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (status === "loading" || loading) {
    return <div className="text-center text-on-surface-variant animate-pulse py-12">Loading applications...</div>;
  }

  if (!session || session.user?.role !== "ADMIN") {
    return <div className="text-center text-error py-12">You do not have permission to view this page.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        title="Review Applications"
        description="Approve or reject provider applications. Approving creates a public provider listing."
      />
      <AdminNav />

      {error && (
        <div className="mb-4 flex items-center gap-2 text-error text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
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
                  <h4 className="font-headline-md text-headline-md text-on-surface">{application.name}</h4>
                  <Chip active={application.status === "PENDING"}>{application.status}</Chip>
                </div>
                <p className="text-on-surface-variant text-sm mb-1">
                  <span className="text-primary">Type:</span> {application.type}
                </p>
                <p className="text-on-surface-variant text-sm mb-2">
                  <span className="text-primary">Cost:</span> {application.cost}
                </p>
                <p className="text-on-surface-variant text-body-md mb-3">{application.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {application.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
                {application.user?.email && (
                  <p className="text-on-surface-variant text-xs mt-2">Applicant: {application.user.email}</p>
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
    </div>
  );
}
