import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

  const { locale, need } = parsed.data;

  try {
    let data: unknown;

    if (need === "hotline") {
      data =
        (await prisma.hotline.findUnique({ where: { locale } })) ??
        (await prisma.hotline.findUnique({ where: { locale: "US" } }));
    } else {
      data = await prisma.grant.findMany({
        orderBy: [{ featured: "desc" }, { name: "asc" }],
      });
    }

    return NextResponse.json({
      status: "success",
      type: need,
      data,
    });
  } catch (error) {
    console.error("Resources DB error:", error);

    return NextResponse.json(
      { status: "error", message: "Service temporarily unavailable." },
      { status: 503 }
    );
  }
}
