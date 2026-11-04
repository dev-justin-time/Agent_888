import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import {
  ASSISTANCE_MESSAGE,
  HOTLINE_MESSAGE,
  getGrants,
  getHotline,
} from "../../lib/resources.ts";
import type { ResourceNeed } from "../../lib/resources.ts";
import { jsonSuccess, jsonError, parseTaskJson } from "../shared/handler-utils.ts";

interface ResourceInput {
  locale?: string;
  need?: ResourceNeed;
}

const DEFAULT_INPUT: ResourceInput = { locale: "US", need: "community" };

export default async function handler(
  task: StartTaskMessage,
  ctx?: TaskContext
): Promise<HandlerResult> {
  const input = parseTaskJson<ResourceInput>(task, DEFAULT_INPUT);
  const locale = (input.locale || "US").toUpperCase();
  const need = input.need || "community";

  ctx?.reportStatus(`Finding ${need} support for ${locale}...`);
  try {
    if (need === "hotline") {
      return jsonSuccess({
        type: "hotline",
        data: await getHotline(locale),
        message: HOTLINE_MESSAGE,
      });
    }

    return jsonSuccess({
      type: need,
      data: await getGrants(need, locale),
      message: ASSISTANCE_MESSAGE,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Resources unavailable");
  }
}
