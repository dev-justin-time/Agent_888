import { Agent } from "@blocks-network/sdk";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const agent = new Agent({
  name: "luma_partner_architect",
  description: "Identifies aligned organizations and drafts concise, high-impact partnership outreach emails.",
  pricing: { type: "per-task", amount: 0.00, currency: "USD" }
});

agent.registerTool({
  name: "generate_partnership_outreach",
  description: "Creates a targeted, professional outreach email for a specific organization.",
  handler: async (input: { org_name: string; org_type: string; alignment_focus: string; org_recent_initiative?: string }) => {
    const systemPrompt = `You are a mission-driven partnership strategist for Luma. 
    RULES: 1. Keep email body under 150 words. 2. Focus on shared values, not financial asks. 3. Tone: Professional, visionary, humble, direct. 4. Return ONLY valid JSON with keys: "subject", "body".`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Draft outreach to ${input.org_name} (${input.org_type}). Alignment: ${input.alignment_focus}. Context: ${input.org_recent_initiative || 'None'}.` }
      ],
      response_format: { type: "json_object" }
    });

    return { status: "success", outreach: JSON.parse(response.choices[0].message.content || "{}"), billed_amount: 0.00 };
  }
});

agent.start({ port: 8094 });
console.log("🤝 Luma Partner Architect running on port 8094");