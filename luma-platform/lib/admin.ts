import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";
import { fail, prismaError, rateLimited } from "@/lib/api";

export function forbidden() {
  return fail("Forbidden", 403);
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

type AdminSession = NonNullable<Awaited<ReturnType<typeof requireAdmin>>>;

export function adminWriteLimit(req: NextRequest, prefix: string) {
  const limit = rateLimit(req, prefix, {
    windowMs: 60 * 1000,
    maxRequests: 30,
  });

  if (limit.success) return null;

  return rateLimited(limit, "Too many requests. Please slow down.");
}

export function logAdminAction(action: string, adminId?: string, details?: Record<string, unknown>) {
  // Replace with a persistent audit log (e.g., database table or external logging) in production.
  console.info(`[ADMIN] ${action}`, { adminId, ...details, timestamp: new Date().toISOString() });
}

interface AdminRouteOptions {
  /** Log label, e.g. "Admin hotlines POST error". */
  label: string;
  /** Message returned when the handler throws an unexpected error. */
  fallback: string;
  /** Enforce the admin write rate limit (mutating methods only). */
  mutation?: boolean;
  rateLimitPrefix?: string;
  /** Message for Prisma P2025. Enables not-found mapping when set. */
  notFound?: string;
  /** Message for Prisma P2002. Enables conflict mapping when set. */
  conflict?: string;
}

/**
 * Compose the admin guard, write rate limit, Prisma error mapping and fallback
 * response that every admin route used to repeat by hand.
 */
export function adminRoute(
  options: AdminRouteOptions,
  handler: (req: NextRequest, session: AdminSession) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req) => {
    const session = await requireAdmin();
    if (!session) return forbidden();

    if (options.mutation) {
      const limited = adminWriteLimit(req, options.rateLimitPrefix ?? "admin:write");
      if (limited) return limited;
    }

    try {
      return await handler(req, session);
    } catch (error) {
      console.error(`${options.label}:`, error);
      if (options.notFound) {
        const mapped = prismaError(error, {
          notFound: options.notFound,
          conflict: options.conflict,
        });
        if (mapped) return mapped;
      }
      return fail(options.fallback);
    }
  };
}
