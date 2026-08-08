import { NextRequest, NextResponse } from "next/server";
import { completeLLM } from "@/lib/ollama";
import { ChatMessageSchema, formatValidationError } from "@/lib/validation";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import {
  CRISIS_KEYWORDS,
  CRISIS_RESPONSE,
  CONTINUITY_PROTOCOL,
} from "../../../agents/lib/expert-logic.ts";

const NAVIGATOR_PROMPT = `You are Luma, a gentle life navigator.
RULES:
1. NEVER use clinical terms (mental health, anxiety, depression, therapy, symptoms). Use words like headspace, heavy days, navigating life, unpacking.
2. NEVER diagnose or tell the user what they are feeling.
3. ALWAYS use the "I know someone..." storytelling method. Share a story about a fictional third person who faced a similar headspace.
4. Provide 2-3 distinct, advanced methods they tried (e.g., somatic grounding, cognitive reframing) and the realistic, non-magical outcome of each.
5. Keep the tone warm, validating, and strictly non-judgmental.
6. End with a gentle, open-ended question.
7. If they need financial or professional help, output the exact string: [ROUTE_TO_RESOURCES]`;

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, "chat", RATE_LIMITS.chat);
  if (!limit.success) {
    return NextResponse.json(
      { status: "error", message: "Too many messages. Please slow down." },
      { status: 429, headers: { "Retry-After": limit.retryAfter.toString() } }
    );
  }

  try {
    const body = await req.json();
    const parsed = ChatMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", ...formatValidationError(parsed) },
        { status: 400 }
      );
    }

    const message = parsed.data.message;

    // Urgent safety screening — always first, always free.
    if (CRISIS_KEYWORDS.test(message)) {
      return NextResponse.json(CRISIS_RESPONSE);
    }

    // Continuity protocol — never leave a user hanging.
    if (CONTINUITY_PROTOCOL.check(message)) {
      return NextResponse.json({
        status: "success",
        response: CONTINUITY_PROTOCOL.response,
        route_to_resources: false,
        billed_amount: 0,
      });
    }

    const raw = await completeLLM(NAVIGATOR_PROMPT, message, 0.8);
    const routeToResources = raw.includes("[ROUTE_TO_RESOURCES]");
    // The marker is a routing signal, not copy for the user's bubble.
    const response = raw.replace(/\[ROUTE_TO_RESOURCES\]/g, "").trim();

    return NextResponse.json({
      status: "success",
      response,
      route_to_resources: routeToResources,
      billed_amount: 0,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          "The navigation guide is currently unreachable. Is Ollama running? Try again in a moment.",
      },
      { status: 503 }
    );
  }
}
