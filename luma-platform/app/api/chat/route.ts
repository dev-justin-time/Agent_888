import { NextRequest, NextResponse } from "next/server"
import { callAgentTool } from "@/lib/agent-client"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { status: "error", message: "Missing or invalid message" },
        { status: 400 }
      );
    }

    const url = process.env.AGENT_NAVIGATOR_URL || "http://localhost:8091";
    const data = await callAgentTool(url, "navigate_headspace", { message });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { status: "error", message: "The navigation guide is currently unreachable. Please try again in a moment." },
      { status: 503 }
    );
  }
}
