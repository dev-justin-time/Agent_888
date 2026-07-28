import { NextRequest, NextResponse } from "next/server"
import { callAgentTool } from "@/lib/agent-client"

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();

    const url = process.env.AGENT_ESCROW_URL || "http://localhost:8095";
    const data = await callAgentTool(url, "create_escrow_instruction", {
      donor_name: input.donor_name || "Anonymous Donor",
      donor_type: input.donor_type || "Individual",
      amount: input.amount || 0,
      currency: input.currency || "USD",
      specific_use_case: input.specific_use_case || "",
      prefer_general_purpose: input.prefer_general_purpose ?? true,
      open_to_growth_strategy: input.open_to_growth_strategy ?? true,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Escrow generation error:", error);
    return NextResponse.json(
      { status: "error", message: "Escrow document generation is temporarily unavailable." },
      { status: 503 }
    );
  }
}
