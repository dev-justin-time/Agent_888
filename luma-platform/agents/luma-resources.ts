import { Agent } from "@blocks-network/sdk";
import { prisma } from "../lib/prisma";

const agent = new Agent({
  name: "luma_resources",
  description: "Finds sponsors, payment assistance, and locale-based hotlines.",
  pricing: { type: "per-task", amount: 0.0, currency: "USD" },
});

agent.registerTool({
  name: "find_support_resources",
  description: "Matches user with sponsors, grants, or local hotlines based on locale.",
  handler: async (input: { locale: string; need: "sponsor" | "hotline" | "community" }) => {
    let result: Record<string, unknown> = {};

    if (input.need === "hotline") {
      const hotline =
        (await prisma.hotline.findUnique({ where: { locale: input.locale } })) ??
        (await prisma.hotline.findUnique({ where: { locale: "US" } }));

      result = {
        type: "hotline",
        data: hotline,
        message: "Here is a safe, immediate connection in your area.",
      };
    } else {
      const grants = await prisma.grant.findMany({
        where: input.need === "sponsor" ? { OR: [{ coverage: input.locale }, { coverage: "Global" }] } : undefined,
        orderBy: [{ featured: "desc" }, { name: "asc" }],
      });

      result = {
        type: input.need,
        data: grants,
        message: "Here are organizations that offer payment assistance.",
      };
    }

    return { status: "success", ...result, billed_amount: 0.0 };
  },
});

agent.start({ port: 8092 });
console.log("🗺️ Luma Resources running on port 8092");
