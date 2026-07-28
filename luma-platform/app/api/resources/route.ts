import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import resources from "../../../data/resources.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "US";
  const need = (searchParams.get("need") as "hotline" | "sponsor" | "community") || "community";

  try {
    let data: unknown;

    if (need === "hotline") {
      const hotline =
        (await prisma.hotline.findUnique({ where: { locale } })) ??
        (await prisma.hotline.findUnique({ where: { locale: "US" } }));
      data = hotline;
    } else {
      data = await prisma.grant.findMany({
        orderBy: [{ featured: "desc" }, { name: "asc" }],
      });
    }

    return NextResponse.json({
      status: "success",
      type: need,
      data,
      billed_amount: 0,
    });
  } catch (error) {
    console.error("Resources DB error:", error);

    let data: unknown;
    if (need === "hotline") {
      data = (resources.hotlines as Record<string, { name: string; number: string; text: string }>)[locale] ?? resources.hotlines["US"];
    } else {
      data = resources.grants;
    }

    return NextResponse.json({
      status: "success",
      type: need,
      data,
      message: "Served from local cache while the database is unavailable.",
      billed_amount: 0,
    });
  }
}
