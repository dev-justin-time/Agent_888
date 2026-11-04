import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";
import { adminRoute, logAdminAction } from "@/lib/admin";
import { ApplicationStatusEnum, ApplicationUpdateSchema } from "@/lib/validation";
import { ok, parseBody } from "@/lib/api";

const RATE_LIMIT_PREFIX = "admin:application";

export const GET = adminRoute(
  { label: "Admin applications GET error", fallback: "Could not load applications" },
  async (req) => {
    const status = new URL(req.url).searchParams.get("status");
    const parsed = ApplicationStatusEnum.safeParse(status);

    const applications = await prisma.providerApplication.findMany({
      where: parsed.success ? { status: parsed.data } : undefined,
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return ok(applications.map((a) => ({ ...a, tags: parseTags(a.tags) })));
  }
);

export const PATCH = adminRoute(
  {
    label: "Admin applications PATCH error",
    fallback: "Could not update application",
    mutation: true,
    rateLimitPrefix: RATE_LIMIT_PREFIX,
    notFound: "Application not found",
  },
  async (req, session) => {
    const body = await parseBody(req, ApplicationUpdateSchema);
    if ("response" in body) return body.response;

    const { id, status } = body.data;

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
    return ok(application);
  }
);
