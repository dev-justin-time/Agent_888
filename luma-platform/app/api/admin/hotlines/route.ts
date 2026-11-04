import { prisma } from "@/lib/prisma";
import { adminRoute, logAdminAction } from "@/lib/admin";
import { HotlineSchema, HotlineUpdateSchema } from "@/lib/validation";
import { fail, ok, parseBody, queryId } from "@/lib/api";

const RATE_LIMIT_PREFIX = "admin:hotline";

export const GET = adminRoute(
  { label: "Admin hotlines GET error", fallback: "Could not load hotlines" },
  async () => {
    const hotlines = await prisma.hotline.findMany({ orderBy: { locale: "asc" } });
    return ok(hotlines);
  }
);

export const POST = adminRoute(
  {
    label: "Admin hotlines POST error",
    fallback: "Could not create hotline",
    mutation: true,
    rateLimitPrefix: RATE_LIMIT_PREFIX,
    conflict: "A hotline already exists for that locale",
  },
  async (req, session) => {
    const body = await parseBody(req, HotlineSchema);
    if ("response" in body) return body.response;

    const hotline = await prisma.hotline.create({ data: body.data });
    logAdminAction("hotline.created", session.user.id, {
      id: hotline.id,
      locale: hotline.locale,
    });
    return ok(hotline, { status: 201 });
  }
);

export const PATCH = adminRoute(
  {
    label: "Admin hotlines PATCH error",
    fallback: "Could not update hotline",
    mutation: true,
    rateLimitPrefix: RATE_LIMIT_PREFIX,
    notFound: "Hotline not found",
    conflict: "A hotline already exists for that locale",
  },
  async (req, session) => {
    const body = await parseBody(req, HotlineUpdateSchema);
    if ("response" in body) return body.response;

    const { id, ...data } = body.data;
    const hotline = await prisma.hotline.update({ where: { id }, data });

    logAdminAction("hotline.updated", session.user.id, {
      id: hotline.id,
      locale: hotline.locale,
    });
    return ok(hotline);
  }
);

export const DELETE = adminRoute(
  {
    label: "Admin hotlines DELETE error",
    fallback: "Could not delete hotline",
    mutation: true,
    rateLimitPrefix: RATE_LIMIT_PREFIX,
    notFound: "Hotline not found",
  },
  async (req, session) => {
    const id = queryId(req);
    if (!id) return fail("Hotline id is required", 400);

    await prisma.hotline.delete({ where: { id } });
    logAdminAction("hotline.deleted", session.user.id, { id });
    return ok(null);
  }
);
