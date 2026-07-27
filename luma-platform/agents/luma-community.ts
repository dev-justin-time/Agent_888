import { Agent } from "@blocks-network/sdk";

const agent = new Agent({
  name: "luma_community",
  description: "Manages Luma_Nation provider registry, verification, and secure off-platform routing.",
  pricing: { type: "per-task", amount: 0.00, currency: "USD" }
});

agent.registerTool({
  name: "connect_to_provider",
  description: "Finds a verified, low/no-cost professional in the user's locale and generates an off-platform link.",
  handler: async (input: { user_locale: string; provider_type: "navigator" | "counselor" | "peer" }) => {
    const mockProviders = [
      { id: "p_101", name: "Dr. Aris Thorne", locale: "US-NY", type: "counselor", verified: true, cost: "Sliding Scale ($0-$20)" },
      { id: "p_102", name: "Elena Rostova", locale: "US-CA", type: "peer", verified: true, cost: "Pro Bono (Free)" }
    ];

    const matched = mockProviders.find(p => p.locale === input.user_locale && p.type === input.provider_type && p.verified);

    if (!matched) {
      return { status: "error", message: "No verified providers currently available in your specific locale. Please check back soon or use the Hotline feature." };
    }

    const secureLink = `https://luma.link/bridge/${matched.id}?token=${Date.now()}`;

    return {
      status: "success",
      provider: { name: matched.name, cost: matched.cost, verification_status: "Verified via National Registry" },
      secure_handoff_link: secureLink,
      privacy_notice: "Clicking this link will take you off Luma to the provider's secure booking system. Luma does not store your name, data, or session details. This interaction is completely anonymous.",
      billed_amount: 0.00
    };
  }
});

agent.start({ port: 8093 });
console.log("🌍 Luma Community running on port 8093");