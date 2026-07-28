import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";

export function forbidden() {
  return NextResponse.json({ status: "error", message: "Forbidden" }, { status: 403 });
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export function adminWriteLimit(req: NextRequest, prefix: string) {
  const limit = rateLimit(req, prefix, {
    windowMs: 60 * 1000,
    maxRequests: 30,
  });

  if (!limit.success) {
    return NextResponse.json(
      {
        status: "error",
        message: "Too many requests. Please slow down.",
        retryAfter: limit.retryAfter,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  return null;
}

export function logAdminAction(action: string, adminId?: string, details?: Record<string, unknown>) {
  // Replace with a persistent audit log (e.g., database table or external logging) in production.
  console.info(`[ADMIN] ${action}`, { adminId, ...details, timestamp: new Date().toISOString() });
}
