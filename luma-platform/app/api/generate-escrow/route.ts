import { NextRequest, NextResponse } from "next/server";
import { callAgentTool } from "@/lib/agent-client";
import { EscrowSchema, formatValidationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = EscrowSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", ...formatValidationError(parsed) },
        { status: 400 }
      );
    }

    const {
      donor_name,
      donor_type,
      amount,
      currency,
      specific_use_case,
      prefer_general_purpose,
      open_to_growth_strategy,
    } = parsed.data;

    const url = process.env.AGENT_ESCROW_URL || "http://localhost:8095";
    const data = await callAgentTool(url, "create_escrow_instruction", {
      donor_name,
      donor_type,
      amount,
      currency,
      specific_use_case,
      prefer_general_purpose,
      open_to_growth_strategy,
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
