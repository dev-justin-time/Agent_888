import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import OpenAI from "openai";
import { getTaskText, jsonResult, jsonError, parseTaskJson } from "../shared/handler-utils.ts";

// Lazily created — the agent starts and stays connected even without a key.
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  _openai ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

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
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: OUTREACH_PROMPT },
        {
          role: "user",
          content: `Draft an outreach email to ${input.org_name} (${input.org_type}).
Alignment focus: ${input.alignment_focus}.
Context: ${input.org_recent_initiative || "None"}.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message.content || "{}";
    return jsonResult({
      status: "success",
      outreach: JSON.parse(raw),
      billed_amount: 0,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Outreach generation failed");
  }
}
