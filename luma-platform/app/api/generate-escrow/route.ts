import { NextRequest } from "next/server";
import { completeJSON } from "@/lib/ollama";
import { EscrowDocumentSchema, EscrowSchema } from "@/lib/validation";
import { fail, parseBody, runRoute, success } from "@/lib/api";

const ESCROW_PROMPT = `You are a meticulous escrow steward for Luma, a mission-aligned funding initiative.
Create a transparent, value-first escrow instruction document.
Return ONLY valid JSON with exactly these keys:
"escrow_document" containing:
- "document_title" (string)
- "fund_source" (string)
- "designated_use" (string)
- "stewardship_strategy" (string)
- "disbursement_conditions" (string)`;

const UNAVAILABLE = "Escrow document generation is temporarily unavailable.";

export async function POST(req: NextRequest) {
  const body = await parseBody(req, EscrowSchema);
  if ("response" in body) return body.response;

  const {
    donor_name,
    donor_type,
    amount,
    currency,
    specific_use_case,
    prefer_general_purpose,
    open_to_growth_strategy,
  } = body.data;

  return runRoute(
    "Escrow generation error",
    async () => {
      const result = await completeJSON<{ escrow_document?: unknown }>(
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
      if (!doc.success) return fail(UNAVAILABLE, 503);

      return success({ escrow_document: doc.data });
    },
    UNAVAILABLE,
    503
  );
}
