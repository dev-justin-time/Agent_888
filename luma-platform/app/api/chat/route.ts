import { NextRequest, NextResponse } from "next/server";
import { BLOCKS_AGENTS, callBlocksAgent } from "@/lib/blocks-agents";
import { ChatMessageSchema, formatValidationError } from "@/lib/validation";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

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

    const result = await callBlocksAgent(BLOCKS_AGENTS.navigator, parsed.data.message);

    if (!result.ok) {
      return NextResponse.json(
        { status: "error", message: "The navigation guide is currently unreachable. Please try again in a moment." },
        { status: 503 }
      );
    }

    return NextResponse.json(result.payload);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { status: "error", message: "The navigation guide is currently unreachable. Please try again in a moment." },
      { status: 503 }
    );
  }
}
