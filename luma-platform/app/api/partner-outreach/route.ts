import { NextRequest, NextResponse } from "next/server";
import { completeJSON } from "@/lib/ollama";
import { OutreachEmailSchema, PartnerOutreachSchema, formatValidationError } from "@/lib/validation";

const OUTREACH_PROMPT = `You are a skilled partnership architect for Luma, a privacy-first, mission-aligned platform.
Write a warm, professional partnership outreach email.
Return ONLY valid JSON with exactly these keys:
"outreach" containing:
- "subject" (string, under 90 characters)
- "body" (string, 2-4 short paragraphs, ends with a specific call to action)`;

interface OutreachEmail {
  subject: string;
  body: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PartnerOutreachSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", ...formatValidationError(parsed) },
        { status: 400 }
      );
    }

    const { org_name, org_type, alignment_focus, org_recent_initiative } = parsed.data;

    const result = await completeJSON<{ outreach?: OutreachEmail }>(
      OUTREACH_PROMPT,
      JSON.stringify({
        org_name,
        org_type,
        alignment_focus,
        org_recent_initiative,
      })
    );

    const email = OutreachEmailSchema.safeParse(result?.outreach);
    if (!email.success) {
      return NextResponse.json(
        { status: "error", message: "Partner outreach generation is temporarily unavailable." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "success",
      outreach: email.data,
    });
  } catch (error) {
    console.error("Partner outreach error:", error);
    return NextResponse.json(
      { status: "error", message: "Partner outreach generation is temporarily unavailable." },
      { status: 503 }
    );
  }
}
