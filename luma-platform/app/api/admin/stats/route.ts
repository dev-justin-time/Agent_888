import { NextResponse } from "next/server";
import { requireAdmin, forbidden } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return forbidden();

  try {
    const [users, applications, hotlines, grants, providers, pendingApplications] = await Promise.all([
      prisma.user.count(),
      prisma.providerApplication.count(),
      prisma.hotline.count(),
      prisma.grant.count(),
      prisma.provider.count(),
      prisma.providerApplication.count({ where: { status: "PENDING" } }),
    ]);

    return NextResponse.json({
      status: "success",
      data: {
        users,
        applications,
        hotlines,
        grants,
        providers,
        pendingApplications,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ status: "error", message: "Could not load stats" }, { status: 500 });
  }
}
