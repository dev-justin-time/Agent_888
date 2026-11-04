import { NextRequest } from "next/server";
import { completeJSON } from "@/lib/ollama";
import { OutreachEmailSchema, PartnerOutreachSchema } from "@/lib/validation";
import { fail, parseBody, runRoute, success } from "@/lib/api";

const OUTREACH_PROMPT = `You are a skilled partnership architect for Luma, a privacy-first, mission-aligned platform.
Write a warm, professional partnership outreach email.
Return ONLY valid JSON with exactly these keys:
"outreach" containing:
- "subject" (string, under 90 characters)
- "body" (string, 2-4 short paragraphs, ends with a specific call to action)`;

const UNAVAILABLE = "Partner outreach generation is temporarily unavailable.";

export async function POST(req: NextRequest) {
  const body = await parseBody(req, PartnerOutreachSchema);
  if ("response" in body) return body.response;

  const { org_name, org_type, alignment_focus, org_recent_initiative } = body.data;

  return runRoute(
    "Partner outreach error",
    async () => {
      const result = await completeJSON<{ outreach?: unknown }>(
        OUTREACH_PROMPT,
        JSON.stringify({ org_name, org_type, alignment_focus, org_recent_initiative })
      );

      const email = OutreachEmailSchema.safeParse(result?.outreach);
      if (!email.success) return fail(UNAVAILABLE, 503);

      return success({ outreach: email.data });
    },
    UNAVAILABLE,
    503
  );
}
