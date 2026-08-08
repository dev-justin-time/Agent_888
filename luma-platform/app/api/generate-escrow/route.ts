import { NextRequest, NextResponse } from "next/server";
import { completeJSON } from "@/lib/ollama";
import { EscrowDocumentSchema, EscrowSchema, formatValidationError } from "@/lib/validation";

const ESCROW_PROMPT = `You are a meticulous escrow steward for Luma, a mission-aligned funding initiative.
Create a transparent, value-first escrow instruction document.
Return ONLY valid JSON with exactly these keys:
"escrow_document" containing:
- "document_title" (string)
- "fund_source" (string)
- "designated_use" (string)
- "stewardship_strategy" (string)
- "disbursement_conditions" (string)`;

interface EscrowDocument {
  document_title: string;
  fund_source: string;
  designated_use: string;
  stewardship_strategy: string;
  disbursement_conditions: string;
}

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

    const result = await completeJSON<{ escrow_document?: EscrowDocument }>(
      ESCROW_PROMPT,
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

    const doc = EscrowDocumentSchema.safeParse(result?.escrow_document);
    if (!doc.success) {
      return NextResponse.json(
        { status: "error", message: "Escrow document generation is temporarily unavailable." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "success",
      escrow_document: doc.data,
    });
  } catch (error) {
    console.error("Escrow generation error:", error);
    return NextResponse.json(
      { status: "error", message: "Escrow document generation is temporarily unavailable." },
      { status: 503 }
    );
  }
}
