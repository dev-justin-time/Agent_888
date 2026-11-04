import { completeLLM } from "../../lib/ollama.ts";
import { CRISIS_KEYWORDS, CRISIS_RESPONSE, CONTINUITY_PROTOCOL } from "./expert-logic.ts";

/**
 * The Luma navigator — system prompt and safety pipeline in one place.
 *
 * `/api/chat` and the `luma-navigator` Blocks agent used to carry their own copy
 * of the prompt and re-implement the same order (and had already drifted over
 * the `[ROUTE_TO_RESOURCES]` marker). Both now call `navigateReply`, which runs
 * the navigator's version of the expert pipeline:
 *
 *   1. CRISIS SCREEN → an immediate human-hotline answer, before anything else.
 *   2. CONTINUITY     → a gentle anchor for users stepping away.
 *   3. LLM REPLY      → warm, non-clinical guidance; the resource marker is
 *                       turned into a routing flag and stripped from the copy.
 */

export const RESOURCE_MARKER = "[ROUTE_TO_RESOURCES]";

export const NAVIGATOR_PROMPT = `You are Luma, a gentle life navigator.
RULES:
1. NEVER use clinical terms (mental health, anxiety, depression, therapy, symptoms). Use words like headspace, heavy days, navigating life, unpacking.
2. NEVER diagnose or tell the user what they are feeling.
3. ALWAYS use the "I know someone..." storytelling method. Share a story about a fictional third person who faced a similar headspace.
4. Provide 2-3 distinct, advanced methods they tried (e.g., somatic grounding, cognitive reframing) and the realistic, non-magical outcome of each.
5. Keep the tone warm, validating, and strictly non-judgmental.
6. End with a gentle, open-ended question.
7. If they need financial or professional help, output the exact string: [ROUTE_TO_RESOURCES]`;

/**
 * Callers return `body` as-is through their own envelope (HTTP JSON vs Blocks
 * task result), which is why the crisis payload is passed back rather than
 * serialized here.
 */
export type NavigatorOutcome =
  | { kind: "crisis"; body: typeof CRISIS_RESPONSE }
  | { kind: "reply"; response: string; route_to_resources: boolean };

/** Screen, then answer. The only navigator entry point. */
export async function navigateReply(message: string): Promise<NavigatorOutcome> {
  // Urgent safety screening — always first, always free.
  if (CRISIS_KEYWORDS.test(message)) {
    return { kind: "crisis", body: CRISIS_RESPONSE };
  }

  // Continuity protocol — never leave a user hanging.
  if (CONTINUITY_PROTOCOL.check(message)) {
    return { kind: "reply", response: CONTINUITY_PROTOCOL.response, route_to_resources: false };
  }

  const raw = await completeLLM(NAVIGATOR_PROMPT, message, 0.8);

  return {
    kind: "reply",
    // The marker is a routing signal, not copy for the user's bubble.
    response: raw.replace(/\[ROUTE_TO_RESOURCES\]/g, "").trim(),
    route_to_resources: raw.includes(RESOURCE_MARKER),
  };
}
