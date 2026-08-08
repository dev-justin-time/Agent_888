import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTags, stringifyTags } from "@/lib/utils";
import { requireAdmin, forbidden, adminWriteLimit, logAdminAction } from "@/lib/admin";
import { GrantSchema, formatValidationError } from "@/lib/validation";

const RATE_LIMIT_PREFIX = "admin:grant";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return forbidden();

  try {
    const grants = await prisma.grant.findMany({ orderBy: [{ featured: "desc" }, { name: "asc" }] });
    const data = grants.map((g) => ({ ...g, tags: parseTags(g.tags) }));
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Admin grants GET error:", error);
    return NextResponse.json({ status: "error", message: "Could not load grants" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const limit = adminWriteLimit(req, RATE_LIMIT_PREFIX);
  if (limit) return limit;

  try {
    const body = await req.json();
    const parsed = GrantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ status: "error", ...formatValidationError(parsed) }, { status: 400 });
    }

    const grant = await prisma.grant.create({
      data: { ...parsed.data, tags: stringifyTags(parsed.data.tags) },
    });
    logAdminAction("grant.created", session.user.id, { id: grant.id, name: grant.name });
    return NextResponse.json({ status: "success", data: grant }, { status: 201 });
  } catch (error) {
    console.error("Admin grants POST error:", error);
    return NextResponse.json({ status: "error", message: "Could not create grant" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const limit = adminWriteLimit(req, RATE_LIMIT_PREFIX);
  if (limit) return limit;

  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ status: "error", message: "Grant id is required" }, { status: 400 });
    }

    const parsed = GrantSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ status: "error", ...formatValidationError(parsed) }, { status: 400 });
    }

    const grant = await prisma.grant.update({
      where: { id },
      data: { ...parsed.data, tags: stringifyTags(parsed.data.tags) },
    });

    logAdminAction("grant.updated", session.user.id, { id: grant.id, name: grant.name });
    return NextResponse.json({ status: "success", data: grant });
  } catch (error: any) {
    console.error("Admin grants PATCH error:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ status: "error", message: "Grant not found" }, { status: 404 });
    }
    return NextResponse.json({ status: "error", message: "Could not update grant" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const limit = adminWriteLimit(req, RATE_LIMIT_PREFIX);
  if (limit) return limit;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ status: "error", message: "Grant id is required" }, { status: 400 });
    }

    await prisma.grant.delete({ where: { id } });
    logAdminAction("grant.deleted", session.user.id, { id });
    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Admin grants DELETE error:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ status: "error", message: "Grant not found" }, { status: 404 });
    }
    return NextResponse.json({ status: "error", message: "Could not delete grant" }, { status: 500 });
  }
}
