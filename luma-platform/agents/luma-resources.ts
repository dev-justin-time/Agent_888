import { Agent } from "@blocks-network/sdk";

const RESOURCE_DB = {
  sponsors: [
    { id: "sp_01", name: "OpenHeart Foundation", coverage: "US", type: "Therapy Grants", amount: "$500" },
    { id: "sp_02", name: "Global Mind Collective", coverage: "Global", type: "App Subsidies", amount: "100%" }
  ],
  hotlines: {
    "US": { name: "988 Lifeline", number: "988", text: "Text HOME to 741741" },
    "UK": { name: "Samaritans", number: "116 123", text: "Text SHOUT to 85258" },
    "CA": { name: "Talk Suicide", number: "1-833-456-4566", text: "Text 45645" }
  }
};

const agent = new Agent({
  name: "luma_resources",
  description: "Finds sponsors, payment assistance, and locale-based hotlines.",
  pricing: { type: "per-task", amount: 0.00, currency: "USD" }
});

agent.registerTool({
  name: "find_support_resources",
  description: "Matches user with sponsors, grants, or local hotlines based on locale.",
  handler: async (input: { locale: string; need: "sponsor" | "hotline" | "community" }) => {
    let result: any = {};
    if (input.need === "hotline") {
      result = { type: "hotline", data: RESOURCE_DB.hotlines[input.locale as keyof typeof RESOURCE_DB.hotlines] || RESOURCE_DB.hotlines["US"], message: "Here is a safe, immediate connection in your area." };
    } else if (input.need === "sponsor") {
      result = { type: "sponsor", data: RESOURCE_DB.sponsors.filter(s => s.coverage === input.locale || s.coverage === "Global"), message: "Here are organizations that offer payment assistance." };
    }
    return { status: "success", ...result, billed_amount: 0.00 };
  }
});

agent.start({ port: 8092 });
console.log("🗺️ Luma Resources running on port 8092");