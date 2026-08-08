/**
 * Top-calls data layer — the 50 most common logic calls / questions / formulas
 * for every Luma agent. Shared by:
 *   - the deterministic matching logic (agents/lib/expert-logic.ts boosts the
 *     best-fit framework when a user message matches a top call),
 *   - the app UI (searchable chip pickers on the Experts, Navigate, Resources,
 *     Community, and Stewardship pages),
 *   - the Blocks agent cards (example prompts shown in the catalog).
 */

export interface TopCall {
  /** Stable slug, e.g. "fin-01". */
  id: string;
  /** The natural-language question / call / formula, as a user would type it. */
  question: string;
  /** Optional UI grouping label (e.g. the framework name). */
  category?: string;
  /** For experts: the deterministic framework id this call maps to. */
  frameworkId?: string;
}

export interface ResourceCall extends TopCall {
  /** What the chip should do on the Resources page. */
  action: "hotline" | "grants";
}

export interface CommunityCall extends TopCall {
  /** Search string the chip sets on the Community page. */
  search: string;
  /** Provider type filter the chip sets. */
  type: "navigator" | "counselor" | "peer" | "all";
}

export interface EscrowCall extends TopCall {
  /** Prefill for the Stewardship escrow form. */
  donorName: string;
  donorType: string;
  amount: string;
  currency: string;
  useCase: string;
}

export interface OutreachCall extends TopCall {
  /** Prefill for the Stewardship outreach form. */
  orgName: string;
  orgType: string;
  alignment: string;
}
