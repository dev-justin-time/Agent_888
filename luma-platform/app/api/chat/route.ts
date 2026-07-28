import { NextRequest, NextResponse } from "next/server";
import { callAgentTool } from "@/lib/agent-client";
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

    const url = process.env.AGENT_NAVIGATOR_URL || "http://localhost:8091";
    const data = await callAgentTool(url, "navigate_headspace", { message: parsed.data.message });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { status: "error", message: "The navigation guide is currently unreachable. Please try again in a moment." },
      { status: 503 }
    );
  }
}
