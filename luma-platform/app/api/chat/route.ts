import { NextRequest, NextResponse } from "next/server";
import { ChatMessageSchema } from "@/lib/validation";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { parseBody, rateLimited, runRoute, success } from "@/lib/api";
import { navigateReply } from "../../../agents/lib/navigator.ts";

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, "chat", RATE_LIMITS.chat);
  if (!limit.success) {
    return rateLimited(limit, "Too many messages. Please slow down.");
  }

  const body = await parseBody(req, ChatMessageSchema);
  if ("response" in body) return body.response;

  const message = body.data.message;

  return runRoute(
    "Chat API error",
    async () => {
      // Crisis screen → continuity → LLM, shared with the luma-navigator agent.
      const outcome = await navigateReply(message);
      if (outcome.kind === "crisis") return NextResponse.json(outcome.body);

      return success({
        response: outcome.response,
        route_to_resources: outcome.route_to_resources,
        billed_amount: 0,
      });
    },
    "The navigation guide is currently unreachable. Is Ollama running? Try again in a moment.",
    503
  );
}
