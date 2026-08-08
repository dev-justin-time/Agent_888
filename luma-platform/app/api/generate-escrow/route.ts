import { NextRequest, NextResponse } from "next/server";
import { BLOCKS_AGENTS, callBlocksAgent } from "@/lib/blocks-agents";
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

    const result = await callBlocksAgent(
      BLOCKS_AGENTS.escrow,
      JSON.stringify({
        donor_name,
        donor_type,
        amount,
        currency,
        specific_use_case,
        prefer_general_purpose,
        open_to_growth_strategy,
      })
    );

    if (!result.ok) {
      return NextResponse.json(
        { status: "error", message: "Escrow document generation is temporarily unavailable." },
        { status: 503 }
      );
    }

    return NextResponse.json(result.payload);
  } catch (error) {
    console.error("Escrow generation error:", error);
    return NextResponse.json(
      { status: "error", message: "Escrow document generation is temporarily unavailable." },
      { status: 503 }
    );
  }
}
