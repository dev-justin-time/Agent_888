import { NextRequest, NextResponse } from "next/server";
import { completeLLM, extractJson } from "@/lib/ollama";
import { ExpertConsultSchema } from "@/lib/validation";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { fail, parseBody, rateLimited, runRoute, success } from "@/lib/api";
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
    return rateLimited(limit, "Too many messages. Please slow down.");
  }

  const body = await parseBody(req, ExpertConsultSchema);
  if ("response" in body) return body.response;

  const topic = TOPIC_BY_ID[body.data.topic];
  if (!topic) {
    return fail("That expert topic is not available.", 404);
  }

  const message = body.data.message;

  // 1. Urgent safety screening — always first, always free.
  if (CRISIS_KEYWORDS.test(message)) {
    return NextResponse.json({
      ...CRISIS_RESPONSE,
      expert: topic.id,
      disclaimer: topic.disclaimer,
    });
  }

  return runRoute(
    "Expert API error",
    async () => {
      // 2. Continuity protocol.
      if (CONTINUITY_PROTOCOL.check(message)) {
        return success({
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

      return success({
        expert: topic.id,
        response,
        framework_used: frameworkUsed,
        route_to_resources: response.includes("[ROUTE_TO_RESOURCES]"),
        disclaimer: topic.disclaimer,
        billed_amount: 0,
      } satisfies Omit<ExpertConsultResponse, "status">);
    },
    "The expert is currently unreachable. Is Ollama running? Try again in a moment.",
    503
  );
}
