import { NextRequest, NextResponse } from "next/server";
import { callBlocksAgent, getExpertAgent } from "@/lib/blocks-agents";
import { ExpertConsultSchema, formatValidationError } from "@/lib/validation";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import type { ExpertConsultResponse } from "@/lib/types";

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

    const spec = getExpertAgent(parsed.data.topic);
    if (!spec) {
      return NextResponse.json(
        { status: "error", message: "That expert topic is not available." },
        { status: 404 }
      );
    }

    const result = await callBlocksAgent(spec, parsed.data.message);

    if (!result.ok) {
      return NextResponse.json(
        { status: "error", message: "The expert is currently unreachable. Please try again in a moment." },
        { status: 503 }
      );
    }

    return NextResponse.json(result.payload as ExpertConsultResponse);
  } catch (error) {
    console.error("Expert API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "The expert is currently unreachable. Please try again in a moment.",
      },
      { status: 503 }
    );
  }
}
