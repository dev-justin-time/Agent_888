import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import {
  NO_PROVIDER_MESSAGE,
  findProviderConnection,
  getVerifiedProviders,
} from "../../lib/providers.ts";
import { jsonResult, jsonSuccess, jsonError, parseTaskJson } from "../shared/handler-utils.ts";

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
      return jsonSuccess({
        data: await getVerifiedProviders(),
        message: "Verified provider directory.",
      });
    }

    const connection = await findProviderConnection(providerType, userLocale);
    if (!connection) {
      return jsonResult({ status: "error", message: NO_PROVIDER_MESSAGE });
    }

    return jsonSuccess({ ...connection });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Community registry unavailable");
  }
}
