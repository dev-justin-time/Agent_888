import { prisma } from "@/lib/prisma";
import { adminRoute } from "@/lib/admin";
import { ok } from "@/lib/api";

export const GET = adminRoute(
  { label: "Admin stats error", fallback: "Could not load stats" },
  async () => {
    const [users, applications, hotlines, grants, providers, pendingApplications] =
      await Promise.all([
        prisma.user.count(),
        prisma.providerApplication.count(),
        prisma.hotline.count(),
        prisma.grant.count(),
        prisma.provider.count(),
        prisma.providerApplication.count({ where: { status: "PENDING" } }),
      ]);

    return ok({ users, applications, hotlines, grants, providers, pendingApplications });
  }
);
