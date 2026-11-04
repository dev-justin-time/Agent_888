import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import { navigateReply } from "../../agents/lib/navigator.ts";
import { getTaskText, jsonResult, jsonSuccess, jsonError } from "../shared/handler-utils.ts";

export default async function handler(
  task: StartTaskMessage,
  ctx?: TaskContext
): Promise<HandlerResult> {
  const message = getTaskText(task);

  ctx?.reportStatus("Listening...");
  try {
    // Crisis screen → continuity → LLM, shared with /api/chat.
    const outcome = await navigateReply(message);
    if (outcome.kind === "crisis") return jsonResult(outcome.body);

    return jsonSuccess({
      response: outcome.response,
      route_to_resources: outcome.route_to_resources,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Navigator unavailable");
  }
}
