import { NextRequest, NextResponse } from "next/server";
import { callAgentTool } from "@/lib/agent-client";
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

    const url = process.env.AGENT_OUTREACH_URL || "http://localhost:8094";
    const data = await callAgentTool(url, "generate_partnership_outreach", {
      org_name,
      org_type,
      alignment_focus,
      org_recent_initiative,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Partner outreach error:", error);
    return NextResponse.json(
      { status: "error", message: "Partner outreach generation is temporarily unavailable." },
      { status: 503 }
    );
  }
}
