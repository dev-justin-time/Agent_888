import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";
import { requireAdmin, forbidden, adminWriteLimit, logAdminAction } from "@/lib/admin";
import { ApplicationUpdateSchema, formatValidationError } from "@/lib/validation";

const RATE_LIMIT_PREFIX = "admin:application";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbidden();

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as "PENDING" | "APPROVED" | "REJECTED" | null;
    const where = status && ["PENDING", "APPROVED", "REJECTED"].includes(status) ? { status } : {};

    const applications = await prisma.providerApplication.findMany({
      where,
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    });

    const data = applications.map((a) => ({ ...a, tags: parseTags(a.tags) }));

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Admin applications GET error:", error);
    return NextResponse.json({ status: "error", message: "Could not load applications" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const limit = adminWriteLimit(req, RATE_LIMIT_PREFIX);
  if (limit) return limit;

  try {
    const body = await req.json();
    const parsed = ApplicationUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ status: "error", ...formatValidationError(parsed) }, { status: 400 });
    }

    const { id, status } = parsed.data;

    const application = await prisma.$transaction(async (tx) => {
      const updated = await tx.providerApplication.update({
        where: { id },
        data: { status },
      });

      if (status === "APPROVED") {
        const exists = await tx.provider.findFirst({ where: { name: updated.name } });
        if (!exists) {
          await tx.provider.create({
            data: {
              name: updated.name,
              type: updated.type,
              cost: updated.cost,
              description: updated.description,
              tags: updated.tags,
              locale: "US",
              verified: true,
            },
          });
        }
      }

      return updated;
    });

    logAdminAction("application.status_updated", session.user.id, { id, status });
    return NextResponse.json({ status: "success", data: application });
  } catch (error: any) {
    console.error("Admin applications PATCH error:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ status: "error", message: "Application not found" }, { status: 404 });
    }
    return NextResponse.json({ status: "error", message: "Could not update application" }, { status: 500 });
  }
}
