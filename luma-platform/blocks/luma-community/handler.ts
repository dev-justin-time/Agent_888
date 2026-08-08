import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import { prisma } from "../../lib/prisma.ts";
import { getTaskText, jsonResult, jsonError, parseTaskJson } from "../shared/handler-utils.ts";

interface CommunityInput {
  action?: "list" | "connect";
  user_locale?: string;
  provider_type?: "navigator" | "counselor" | "peer";
}

const DEFAULT_INPUT: CommunityInput = { action: "connect", user_locale: "US", provider_type: "peer" };

export default async function handler(
  task: StartTaskMessage,
  ctx?: TaskContext
): Promise<HandlerResult> {
  const input = parseTaskJson<CommunityInput>(task, DEFAULT_INPUT);
  const action = input.action || "connect";
  const userLocale = (input.user_locale || "US").toUpperCase();
  const providerType = input.provider_type || "peer";

  ctx?.reportStatus(
    action === "list"
      ? "Listing the verified provider directory..."
      : `Searching the verified registry for ${userLocale}...`
  );
  try {
    if (action === "list") {
      const providers = await prisma.provider.findMany({
        where: { verified: true },
        orderBy: { name: "asc" },
      });
      return jsonResult({
        status: "success",
        data: providers,
        message: "Verified provider directory.",
        billed_amount: 0,
      });
    }

    const providers = await prisma.provider.findMany({
      where: { type: providerType },
    });

    const matched = providers.find(
      (p) =>
        p.locale === userLocale ||
        p.locale.startsWith(userLocale.split("-")[0])
    );

    if (!matched) {
      return jsonResult({
        status: "error",
        message:
          "No verified providers currently available in your specific locale. Please check back soon or use the Hotline feature.",
      });
    }

    const secureLink = `https://luma.link/bridge/${matched.id}?token=${Date.now()}`;

    return jsonResult({
      status: "success",
      provider: {
        name: matched.name,
        cost: matched.cost,
        verification_status: "Verified via National Registry",
      },
      secure_handoff_link: secureLink,
      privacy_notice:
        "Clicking this link will take you off Luma to the provider's secure booking system. Luma does not store your name, data, or session details. This interaction is completely anonymous.",
      billed_amount: 0,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Community registry unavailable");
  }
}
