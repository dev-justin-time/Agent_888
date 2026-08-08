import { NextRequest, NextResponse } from "next/server";
import { callAgentTool } from "@/lib/agent-client";
import { ExpertConsultSchema, formatValidationError } from "@/lib/validation";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import type { ExpertConsultResponse } from "@/lib/types";

const EXPERT_ENDPOINTS: Record<string, { url: string; tool: string }> = {
  finance: {
    url: process.env.AGENT_EXPERT_FINANCE_URL || "http://localhost:8101",
    tool: "consult_finance",
  },
  legal: {
    url: process.env.AGENT_EXPERT_LEGAL_URL || "http://localhost:8102",
    tool: "consult_legal",
  },
  career: {
    url: process.env.AGENT_EXPERT_CAREER_URL || "http://localhost:8103",
    tool: "consult_career",
  },
  learning: {
    url: process.env.AGENT_EXPERT_LEARNING_URL || "http://localhost:8104",
    tool: "consult_learning",
  },
  home: {
    url: process.env.AGENT_EXPERT_HOME_URL || "http://localhost:8105",
    tool: "consult_home",
  },
  digital: {
    url: process.env.AGENT_EXPERT_DIGITAL_URL || "http://localhost:8106",
    tool: "consult_digital",
  },
  wellbeing: {
    url: process.env.AGENT_EXPERT_WELLBEING_URL || "http://localhost:8107",
    tool: "consult_wellbeing",
  },
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

    const endpoint = EXPERT_ENDPOINTS[parsed.data.topic];
    if (!endpoint) {
      return NextResponse.json(
        { status: "error", message: "That expert topic is not available." },
        { status: 404 }
      );
    }

    const data = await callAgentTool<ExpertConsultResponse>(endpoint.url, endpoint.tool, {
      message: parsed.data.message,
    });

    return NextResponse.json(data);
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
