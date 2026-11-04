import { prisma } from "@/lib/prisma";
import { parseTags, stringifyTags } from "@/lib/utils";
import { adminRoute, logAdminAction } from "@/lib/admin";
import { GrantSchema, GrantUpdateSchema } from "@/lib/validation";
import { fail, ok, parseBody, queryId } from "@/lib/api";

const RATE_LIMIT_PREFIX = "admin:grant";

export const GET = adminRoute(
  { label: "Admin grants GET error", fallback: "Could not load grants" },
  async () => {
    const grants = await prisma.grant.findMany({
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });
    return ok(grants.map((grant) => ({ ...grant, tags: parseTags(grant.tags) })));
  }
);

export const POST = adminRoute(
  {
    label: "Admin grants POST error",
    fallback: "Could not create grant",
    mutation: true,
    rateLimitPrefix: RATE_LIMIT_PREFIX,
  },
  async (req, session) => {
    const body = await parseBody(req, GrantSchema);
    if ("response" in body) return body.response;

    const grant = await prisma.grant.create({
      data: { ...body.data, tags: stringifyTags(body.data.tags) },
    });
    logAdminAction("grant.created", session.user.id, { id: grant.id, name: grant.name });
    return ok(grant, { status: 201 });
  }
);

export const PATCH = adminRoute(
  {
    label: "Admin grants PATCH error",
    fallback: "Could not update grant",
    mutation: true,
    rateLimitPrefix: RATE_LIMIT_PREFIX,
    notFound: "Grant not found",
  },
  async (req, session) => {
    const body = await parseBody(req, GrantUpdateSchema);
    if ("response" in body) return body.response;

    const { id, ...data } = body.data;
    const grant = await prisma.grant.update({
      where: { id },
      data: { ...data, tags: stringifyTags(data.tags) },
    });

    logAdminAction("grant.updated", session.user.id, { id: grant.id, name: grant.name });
    return ok(grant);
  }
);

export const DELETE = adminRoute(
  {
    label: "Admin grants DELETE error",
    fallback: "Could not delete grant",
    mutation: true,
    rateLimitPrefix: RATE_LIMIT_PREFIX,
    notFound: "Grant not found",
  },
  async (req, session) => {
    const id = queryId(req);
    if (!id) return fail("Grant id is required", 400);

    await prisma.grant.delete({ where: { id } });
    logAdminAction("grant.deleted", session.user.id, { id });
    return ok(null);
  }
);
