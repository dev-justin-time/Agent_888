import { NextRequest, NextResponse } from "next/server"
import { callAgentTool } from "@/lib/agent-client"

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();

    if (!input.org_name || !input.org_type || !input.alignment_focus) {
      return NextResponse.json(
        { status: "error", message: "Missing org_name, org_type, or alignment_focus" },
        { status: 400 }
      );
    }

    const url = process.env.AGENT_OUTREACH_URL || "http://localhost:8094";
    const data = await callAgentTool(url, "generate_partnership_outreach", {
      org_name: input.org_name,
      org_type: input.org_type,
      alignment_focus: input.alignment_focus,
      org_recent_initiative: input.org_recent_initiative || "",
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
