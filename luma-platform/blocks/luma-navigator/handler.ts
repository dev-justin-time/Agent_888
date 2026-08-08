import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import OpenAI from "openai";
import { CRISIS_KEYWORDS, CRISIS_RESPONSE, CONTINUITY_PROTOCOL } from "../../agents/lib/expert-logic.ts";
import { getTaskText, jsonResult, jsonError } from "../shared/handler-utils.ts";

// Lazily created — the agent starts and stays connected even without a key.
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  _openai ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

const NAVIGATOR_PROMPT = `You are Luma, a gentle life navigator. 
RULES:
1. NEVER use clinical terms (mental health, anxiety, depression, therapy, symptoms). Use words like headspace, heavy days, navigating life, unpacking.
2. NEVER diagnose or tell the user what they are feeling.
3. ALWAYS use the "I know someone..." storytelling method. Share a story about a fictional third person who faced a similar headspace.
4. Provide 2-3 distinct, advanced methods they tried (e.g., somatic grounding, cognitive reframing) and the realistic, non-magical outcome of each.
5. Keep the tone warm, validating, and strictly non-judgmental.
6. End with a gentle, open-ended question.
7. If they need financial or professional help, output the exact string: [ROUTE_TO_RESOURCES]`;

export default async function handler(
  task: StartTaskMessage,
  ctx?: TaskContext
): Promise<HandlerResult> {
  const message = getTaskText(task);

  // Urgent safety screening — always first, always free.
  if (CRISIS_KEYWORDS.test(message)) {
    return jsonResult(CRISIS_RESPONSE);
  }

  // Continuity protocol — never leave a user hanging.
  if (CONTINUITY_PROTOCOL.check(message)) {
    return jsonResult({
      status: "success",
      response: CONTINUITY_PROTOCOL.response,
      route_to_resources: false,
      billed_amount: 0,
    });
  }

  ctx?.reportStatus("Listening...");
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: NAVIGATOR_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.8,
    });

    const text = completion.choices[0]?.message.content || "";
    return jsonResult({
      status: "success",
      response: text,
      route_to_resources: text.includes("[ROUTE_TO_RESOURCES]"),
      billed_amount: 0,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Navigator unavailable");
  }
}
