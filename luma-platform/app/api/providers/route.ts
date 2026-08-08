import { NextRequest, NextResponse } from "next/server";
import { BLOCKS_AGENTS, callBlocksAgent } from "@/lib/blocks-agents";
import { ProviderConnectSchema, formatValidationError } from "@/lib/validation";

export async function GET() {
  const result = await callBlocksAgent(
    BLOCKS_AGENTS.community,
    JSON.stringify({ action: "list" })
  );

  if (!result.ok) {
    return NextResponse.json(
      { status: "error", message: "Provider directory is currently unavailable." },
      { status: 503 }
    );
  }

  return NextResponse.json(result.payload);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ProviderConnectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", ...formatValidationError(parsed) },
        { status: 400 }
      );
    }

    const result = await callBlocksAgent(
      BLOCKS_AGENTS.community,
      JSON.stringify({
        action: "connect",
        user_locale: parsed.data.user_locale,
        provider_type: parsed.data.provider_type,
      })
    );

    if (!result.ok) {
      return NextResponse.json(
        { status: "error", message: "Could not connect to a provider right now." },
        { status: 503 }
      );
    }

    return NextResponse.json(result.payload);
  } catch (error) {
    console.error("Provider connection error:", error);
    return NextResponse.json(
      { status: "error", message: "Could not connect to a provider right now." },
      { status: 503 }
    );
  }
}
