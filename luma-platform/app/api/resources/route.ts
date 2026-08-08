import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";
import { ResourceNeedSchema, formatValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const parsed = ResourceNeedSchema.safeParse({
    locale: searchParams.get("locale") ?? undefined,
    need: searchParams.get("need") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { status: "error", ...formatValidationError(parsed) },
      { status: 400 }
    );
  }

  const locale = (parsed.data.locale ?? "US").toUpperCase();
  const need = parsed.data.need ?? "community";

  try {
    if (need === "hotline") {
      const hotline =
        (await prisma.hotline.findUnique({ where: { locale } })) ??
        (await prisma.hotline.findUnique({ where: { locale: "US" } }));
      return NextResponse.json({
        status: "success",
        type: "hotline",
        data: hotline,
        message: "Here is a safe, immediate connection in your area.",
      });
    }

    const grants = await prisma.grant.findMany({
      where:
        need === "sponsor"
          ? { OR: [{ coverage: locale }, { coverage: "Global" }] }
          : undefined,
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });

    const data = grants.map((grant) => ({ ...grant, tags: parseTags(grant.tags) }));

    return NextResponse.json({
      status: "success",
      type: need,
      data,
      message: "Here are organizations that offer payment assistance.",
    });
  } catch (error) {
    console.error("Resources API error:", error);
    return NextResponse.json(
      { status: "error", message: "Resources are temporarily unavailable." },
      { status: 503 }
    );
  }
}
