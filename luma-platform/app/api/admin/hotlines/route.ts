import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, forbidden, adminWriteLimit, logAdminAction } from "@/lib/admin";
import { HotlineSchema, formatValidationError } from "@/lib/validation";

const RATE_LIMIT_PREFIX = "admin:hotline";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return forbidden();

  try {
    const hotlines = await prisma.hotline.findMany({ orderBy: { locale: "asc" } });
    return NextResponse.json({ status: "success", data: hotlines });
  } catch (error) {
    console.error("Admin hotlines GET error:", error);
    return NextResponse.json({ status: "error", message: "Could not load hotlines" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const limit = adminWriteLimit(req, RATE_LIMIT_PREFIX);
  if (limit) return limit;

  try {
    const body = await req.json();
    const parsed = HotlineSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ status: "error", ...formatValidationError(parsed) }, { status: 400 });
    }

    const hotline = await prisma.hotline.create({ data: parsed.data });
    logAdminAction("hotline.created", session.user.id, { id: hotline.id, locale: hotline.locale });
    return NextResponse.json({ status: "success", data: hotline }, { status: 201 });
  } catch (error: any) {
    console.error("Admin hotlines POST error:", error);
    if (error?.code === "P2002") {
      return NextResponse.json({ status: "error", message: "A hotline already exists for that locale" }, { status: 409 });
    }
    return NextResponse.json({ status: "error", message: "Could not create hotline" }, { status: 500 });
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
      return NextResponse.json({ status: "error", message: "Hotline id is required" }, { status: 400 });
    }

    const parsed = HotlineSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ status: "error", ...formatValidationError(parsed) }, { status: 400 });
    }

    const hotline = await prisma.hotline.update({
      where: { id },
      data: parsed.data,
    });

    logAdminAction("hotline.updated", session.user.id, { id: hotline.id, locale: hotline.locale });
    return NextResponse.json({ status: "success", data: hotline });
  } catch (error: any) {
    console.error("Admin hotlines PATCH error:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ status: "error", message: "Hotline not found" }, { status: 404 });
    }
    if (error?.code === "P2002") {
      return NextResponse.json({ status: "error", message: "A hotline already exists for that locale" }, { status: 409 });
    }
    return NextResponse.json({ status: "error", message: "Could not update hotline" }, { status: 500 });
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
      return NextResponse.json({ status: "error", message: "Hotline id is required" }, { status: 400 });
    }

    await prisma.hotline.delete({ where: { id } });
    logAdminAction("hotline.deleted", session.user.id, { id });
    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Admin hotlines DELETE error:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ status: "error", message: "Hotline not found" }, { status: 404 });
    }
    return NextResponse.json({ status: "error", message: "Could not delete hotline" }, { status: 500 });
  }
}
