"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Phone, Heart, Briefcase, FileText } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/Button";
import { ErrorAlert } from "@/components/ui/Feedback";
import type { AdminStats } from "@/lib/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        if (!active) return;
        if (json.status === "success" && json.data) {
          setStats(json.data);
        } else {
          setError("Could not load dashboard stats.");
        }
      } catch {
        if (active) setError("Could not load dashboard stats.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminPage
      title="Admin Dashboard"
      description="Manage hotlines, grants, and provider applications."
      loading={loading}
      loadingText="Loading dashboard..."
    >
      <ErrorAlert message={error} className="mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard label="Users" value={stats?.users ?? 0} icon={<Users size={24} />} />
        <StatCard
          label="Pending Applications"
          value={stats?.pendingApplications ?? 0}
          icon={<FileText size={24} />}
        />
        <StatCard label="Hotlines" value={stats?.hotlines ?? 0} icon={<Phone size={24} />} />
        <StatCard label="Grants" value={stats?.grants ?? 0} icon={<Heart size={24} />} />
        <StatCard label="Providers" value={stats?.providers ?? 0} icon={<Briefcase size={24} />} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/hotlines">
          <Button>Manage Hotlines</Button>
        </Link>
        <Link href="/admin/grants">
          <Button variant="secondary">Manage Grants</Button>
        </Link>
        <Link href="/admin/applications">
          <Button variant="outline">Review Applications</Button>
        </Link>
      </div>
    </AdminPage>
  );
}
