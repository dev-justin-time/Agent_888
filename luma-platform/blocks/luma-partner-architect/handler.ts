import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import { completeJSON } from "../../lib/ollama.ts";
import { getTaskText, jsonSuccess, jsonError, parseTaskJson } from "../shared/handler-utils.ts";

interface OutreachInput {
  org_name?: string;
  org_type?: string;
  alignment_focus?: string;
  org_recent_initiative?: string;
}

const DEFAULT_INPUT: OutreachInput = {
  org_name: "",
  org_type: "",
  alignment_focus: "",
  org_recent_initiative: "",
};

const OUTREACH_PROMPT = `You are a mission-driven partnership strategist for Luma, a privacy-first, zero-label life navigation platform.
RULES:
1. Keep the email body under 150 words. Be respectful of their time.
2. Focus on shared values, not financial asks.
3. Tone: Professional, visionary, humble, and direct.
4. Structure: subject line (max 8 words), the hook (acknowledge their specific recent work or core mission), the alignment (how Luma's zero-label, privacy-first approach complements their goals), the ask (a simple 15-minute exploratory call, no pressure), warm sign-off.
5. Return ONLY valid JSON with keys: "subject", "body".`;

export default async function handler(
  task: StartTaskMessage,
  ctx?: TaskContext
): Promise<HandlerResult> {
  const input = parseTaskJson<OutreachInput>(task, DEFAULT_INPUT);
  ctx?.reportStatus("Drafting outreach...");
  try {
    const outreach = await completeJSON<Record<string, unknown>>(
      OUTREACH_PROMPT,
      `Draft an outreach email to ${input.org_name} (${input.org_type}).
Alignment focus: ${input.alignment_focus}.
Context: ${input.org_recent_initiative || "None"}.`,
      0.5
    );
    if (!outreach) return jsonError("Outreach generation returned invalid JSON.");

    return jsonSuccess({ outreach });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Outreach generation failed");
  }
}
