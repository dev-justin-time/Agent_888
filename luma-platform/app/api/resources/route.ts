import { NextRequest, NextResponse } from "next/server";
import { BLOCKS_AGENTS, callBlocksAgent } from "@/lib/blocks-agents";
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

  const result = await callBlocksAgent(
    BLOCKS_AGENTS.resources,
    JSON.stringify({ locale: parsed.data.locale, need: parsed.data.need })
  );

  if (!result.ok) {
    return NextResponse.json(
      { status: "error", message: "Resources are temporarily unavailable." },
      { status: 503 }
    );
  }

  return NextResponse.json(result.payload);
}
