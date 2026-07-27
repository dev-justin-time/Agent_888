import { Agent } from "@blocks-network/sdk";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const agent = new Agent({
  name: "luma_escrow_steward",
  description: "Generates transparent escrow instructions for mission funding, emphasizing value-first stewardship.",
  pricing: { type: "per-task", amount: 0.00, currency: "USD" }
});

agent.registerTool({
  name: "create_escrow_instruction",
  description: "Creates a formal, flexible escrow instruction document for incoming funds.",
  handler: async (input: { donor_name: string; donor_type: string; amount: number; currency: string; specific_use_case?: string; prefer_general_purpose?: boolean; open_to_growth_strategy?: boolean }) => {
    const systemPrompt = `You are a fiduciary steward for Luma. Draft escrow instructions that are legally clear, deeply transparent, and philosophically aligned with our "value-first" mission. 
    RULES: 1. Never dictate use if donor chooses "General Purpose". 2. If open to growth, include: "We do not require this, but if our service proves excellent, this is how we suggest managing the surplus to ensure long-term impact. If our service is not excellent, the funds will not grow, and that is a fair outcome." 3. Return ONLY valid JSON with keys: "document_title", "fund_source", "designated_use", "stewardship_strategy", "disbursement_conditions".`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create escrow for ${input.donor_name} (${input.donor_type}) for ${input.amount} ${input.currency}. Use case: ${input.specific_use_case || "None"}. General purpose: ${input.prefer_general_purpose}. Growth strategy: ${input.open_to_growth_strategy}.` }
      ],
      response_format: { type: "json_object" }
    });

    return { status: "success", escrow_document: JSON.parse(response.choices[0].message.content || "{}"), billed_amount: 0.00 };
  }
});

agent.start({ port: 8095 });
console.log("🏦 Luma Escrow Steward running on port 8095");