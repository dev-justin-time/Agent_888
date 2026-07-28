"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Users, Phone, Heart, Briefcase, FileText } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { StatCard } from "@/components/admin/StatCard";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { Button } from "@/components/ui/Button";

interface Stats {
  users: number;
  applications: number;
  hotlines: number;
  grants: number;
  providers: number;
  pendingApplications: number;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : { status: "error" }))
      .then((res) => {
        if (res.status === "success" && res.data) {
          setStats(res.data);
        } else {
          setError("Could not load dashboard stats.");
        }
      })
      .catch(() => setError("Could not load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="text-center text-on-surface-variant animate-pulse py-12">
        Loading dashboard...
      </div>
    );
  }

  if (!session || session.user?.role !== "ADMIN") {
    return (
      <div className="text-center text-error py-12">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        title="Admin Dashboard"
        description="Manage hotlines, grants, and provider applications."
      />
      <AdminNav />

      {error && <p className="text-error text-sm mb-6">{error}</p>}

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
    </div>
  );
}
