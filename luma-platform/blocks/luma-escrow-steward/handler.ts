import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import { completeJSON } from "../../lib/ollama.ts";
import { getTaskText, jsonResult, jsonError, parseTaskJson } from "../shared/handler-utils.ts";

interface EscrowInput {
  donor_name?: string;
  donor_type?: string;
  amount?: number;
  currency?: string;
  specific_use_case?: string;
  prefer_general_purpose?: boolean;
  open_to_growth_strategy?: boolean;
}

const DEFAULT_INPUT: EscrowInput = {
  donor_name: "Anonymous Donor",
  donor_type: "Individual",
  amount: 0,
  currency: "USD",
  specific_use_case: "",
  prefer_general_purpose: true,
  open_to_growth_strategy: true,
};

const ESCROW_PROMPT = `You are a fiduciary steward for Luma. Draft escrow instructions that are legally clear, deeply transparent, and philosophically aligned with our "value-first" mission.
RULES:
1. Never dictate how funds must be used if the donor chooses "General Purpose".
2. If they are open to a growth strategy, include a "Suggested Stewardship & Growth" section framed as: "We do not require this, but if our service proves excellent, this is how we suggest managing the surplus to ensure long-term impact. If our service is not excellent, the funds will not grow, and that is a fair outcome."
3. Tone: Trustworthy, humble, precise, and mission-driven.
4. Return ONLY valid JSON with keys: "document_title", "fund_source", "designated_use", "stewardship_strategy", "disbursement_conditions".`;

export default async function handler(
  task: StartTaskMessage,
  ctx?: TaskContext
): Promise<HandlerResult> {
  const input = parseTaskJson<EscrowInput>(task, DEFAULT_INPUT);
  ctx?.reportStatus("Drafting escrow instructions...");
  try {
    const document = await completeJSON<Record<string, unknown>>(
      ESCROW_PROMPT,
      `Create an escrow instruction for ${input.donor_name} (${input.donor_type}) for ${input.amount} ${input.currency}.
Specific use case: ${input.specific_use_case || "None specified"}.
Prefer general purpose: ${input.prefer_general_purpose}.
Open to growth strategy: ${input.open_to_growth_strategy}.`,
      0.5
    );
    if (!document) return jsonError("Escrow generation returned invalid JSON.");

    return jsonResult({
      status: "success",
      escrow_document: document,
      billed_amount: 0,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Escrow generation failed");
  }
}
