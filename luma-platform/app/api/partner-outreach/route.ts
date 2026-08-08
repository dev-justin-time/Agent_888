import { NextRequest, NextResponse } from "next/server";
import { BLOCKS_AGENTS, callBlocksAgent } from "@/lib/blocks-agents";
import { PartnerOutreachSchema, formatValidationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PartnerOutreachSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", ...formatValidationError(parsed) },
        { status: 400 }
      );
    }

    const { org_name, org_type, alignment_focus, org_recent_initiative } = parsed.data;

    const result = await callBlocksAgent(
      BLOCKS_AGENTS.outreach,
      JSON.stringify({
        org_name,
        org_type,
        alignment_focus,
        org_recent_initiative,
      })
    );

    if (!result.ok) {
      return NextResponse.json(
        { status: "error", message: "Partner outreach generation is temporarily unavailable." },
        { status: 503 }
      );
    }

    return NextResponse.json(result.payload);
  } catch (error) {
    console.error("Partner outreach error:", error);
    return NextResponse.json(
      { status: "error", message: "Partner outreach generation is temporarily unavailable." },
      { status: 503 }
    );
  }
}
