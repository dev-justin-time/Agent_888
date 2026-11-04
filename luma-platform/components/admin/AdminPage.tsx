"use client";

import { useSession } from "next-auth/react";
import { AdminNav } from "@/components/admin/AdminNav";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { AccessDenied, LoadingState } from "@/components/ui/Feedback";

interface AdminPageProps {
  title: string;
  description?: string;
  /** True while the page's own data is loading. */
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

/**
 * Admin page frame: role guard + header + section nav, which every admin page
 * repeated inline. The middleware already blocks non-admins; this keeps the
 * client-side guard as a single point of defense in depth.
 */
export function AdminPage({
  title,
  description,
  loading = false,
  loadingText = "Loading...",
  children,
}: AdminPageProps) {
  const { data: session, status } = useSession();

  if (status === "loading") return <LoadingState />;

  if (!session || session.user?.role !== "ADMIN") return <AccessDenied />;

  if (loading) return <LoadingState text={loadingText} />;

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader title={title} description={description} />
      <AdminNav />
      {children}
    </div>
  );
}
