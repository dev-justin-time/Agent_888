import { NextRequest, NextResponse } from "next/server";
import { completeLLM, extractJson } from "@/lib/ollama";
import { ExpertConsultSchema, formatValidationError } from "@/lib/validation";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import type { ExpertConsultResponse } from "@/lib/types";
import {
  CRISIS_KEYWORDS,
  CRISIS_RESPONSE,
  CONTINUITY_PROTOCOL,
  detectResourceNeed,
  matchFramework,
  formatFrameworkAnswer,
  buildScaffold,
  fallbackAnswer,
  type ExpertTopic,
} from "../../../agents/lib/expert-logic.ts";
import {
  FINANCE_TOPIC,
  LEGAL_TOPIC,
  CAREER_TOPIC,
  LEARNING_TOPIC,
  HOME_TOPIC,
  DIGITAL_TOPIC,
  WELLBEING_TOPIC,
} from "../../../agents/lib/expert-topics.ts";

const TOPIC_BY_ID: Record<string, ExpertTopic> = {
  finance: FINANCE_TOPIC,
  legal: LEGAL_TOPIC,
  career: CAREER_TOPIC,
  learning: LEARNING_TOPIC,
  home: HOME_TOPIC,
  digital: DIGITAL_TOPIC,
  wellbeing: WELLBEING_TOPIC,
};

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, "expert", RATE_LIMITS.expert);
  if (!limit.success) {
    return NextResponse.json(
      { status: "error", message: "Too many messages. Please slow down." },
      { status: 429, headers: { "Retry-After": limit.retryAfter.toString() } }
    );
  }

  try {
    const body = await req.json();
    const parsed = ExpertConsultSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", ...formatValidationError(parsed) },
        { status: 400 }
      );
    }

    const topic = TOPIC_BY_ID[parsed.data.topic];
    if (!topic) {
      return NextResponse.json(
        { status: "error", message: "That expert topic is not available." },
        { status: 404 }
      );
    }

    const message = parsed.data.message;

    // 1. Urgent safety screening — always first, always free.
    if (CRISIS_KEYWORDS.test(message)) {
      return NextResponse.json({
        ...CRISIS_RESPONSE,
        expert: topic.id,
        disclaimer: topic.disclaimer,
      });
    }

    // 2. Continuity protocol.
    if (CONTINUITY_PROTOCOL.check(message)) {
      return NextResponse.json({
        status: "success",
        expert: topic.id,
        response: CONTINUITY_PROTOCOL.response,
        route_to_resources: false,
        billed_amount: 0,
      });
    }

    // 3. Deterministic framework match (curated knowledge base).
    const fw = matchFramework(topic, message);

    // 4. Local LLM enrichment — with a guaranteed deterministic fallback: if
    // the model is down or returns unusable output, the curated framework
    // still answers. An expert never fails silently.
    const scaffold = buildScaffold(topic, fw);
    let parsedLLM: { response?: string; framework_used?: string } | null = null;
    try {
      const raw = await completeLLM(
        topic.systemPrompt,
        `USER MESSAGE:\n${message}\n\n${scaffold}\n\nReturn ONLY valid JSON with exactly these keys: "response" (your full guidance, 1-3 short paragraphs, ending with one gentle next step), "framework_used" (the framework name or "General").`,
        0.7
      );
      parsedLLM = extractJson<{ response?: string; framework_used?: string }>(raw);
    } catch (error) {
      console.error("Expert LLM error, serving deterministic fallback:", error);
    }

    let response =
      parsedLLM?.response?.trim() || (fw ? formatFrameworkAnswer(fw) : fallbackAnswer(topic));
    const frameworkUsed = parsedLLM?.framework_used || fw?.name || "General";

    // 5. Resource routing — marker-driven, like the navigator. The app only
    // redirects when the final response contains [ROUTE_TO_RESOURCES].
    if (!response.includes("[ROUTE_TO_RESOURCES]") && detectResourceNeed(message)) {
      response += "\n\n[ROUTE_TO_RESOURCES]";
    }
    const routeToResources = response.includes("[ROUTE_TO_RESOURCES]");

    return NextResponse.json({
      status: "success",
      expert: topic.id,
      response,
      framework_used: frameworkUsed,
      route_to_resources: routeToResources,
      disclaimer: topic.disclaimer,
      billed_amount: 0,
    } satisfies ExpertConsultResponse);
  } catch (error) {
    console.error("Expert API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          "The expert is currently unreachable. Is Ollama running? Try again in a moment.",
      },
      { status: 503 }
    );
  }
}
