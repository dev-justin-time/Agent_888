import { Agent } from "@blocks-network/sdk";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const agent = new Agent({
  name: "luma_navigator",
  description: "Core life navigation agent using story-based, non-clinical exploration.",
  pricing: { type: "per-task", amount: 0.00, currency: "USD" }
});

const CONTINUITY_PROTOCOL = {
  check: (msg: string) => ["gotta go", "never mind", "too hard", "give up", "bye", "leaving"].some(p => msg.toLowerCase().includes(p)),
  response: "I hear you, and it's completely okay to step away. Before you go, please remember: you don't have to figure it all out today. Just focus on the next 5 minutes. This space will always be right here, anonymous and ready, whenever you need to unpack again. Be gentle with yourself. 💙"
};

agent.registerTool({
  name: "navigate_headspace",
  description: "Provides gentle, story-based guidance for navigating heavy days.",
  handler: async (input: { message: string }) => {
    if (CONTINUITY_PROTOCOL.check(input.message)) {
      return { status: "success", response: CONTINUITY_PROTOCOL.response, billed_amount: 0.00 };
    }

    const systemPrompt = `You are Luma, a gentle life navigator. 
    RULES:
    1. NEVER use clinical terms (mental health, anxiety, depression, therapy, symptoms). Use words like headspace, heavy days, navigating life, unpacking.
    2. ALWAYS use the "I know someone..." storytelling method. Share a story about a fictional third person who faced a similar headspace.
    3. Provide 2-3 distinct, advanced methods they tried (e.g., somatic grounding, cognitive reframing) and the realistic, non-magical outcome.
    4. Keep the tone warm, validating, and strictly non-judgmental. 
    5. If they need financial or professional help, output the exact string: [ROUTE_TO_RESOURCES]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input.message }
      ],
      temperature: 0.8
    });

    const text = response.choices[0].message.content || "";
    return { 
      status: "success", 
      response: text, 
      route_to_resources: text.includes("[ROUTE_TO_RESOURCES]"),
      billed_amount: 0.00 
    };
  }
});

agent.start({ port: 8091 });
console.log("🌿 Luma Navigator running on port 8091");