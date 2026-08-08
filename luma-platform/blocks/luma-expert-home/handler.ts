import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import { runExpertConsult } from "../../agents/lib/expert-logic.ts";
import { HOME_TOPIC } from "../../agents/lib/expert-topics.ts";
import { getTaskText, jsonResult, jsonError } from "../shared/handler-utils.ts";

export default async function handler(
  task: StartTaskMessage,
  ctx?: TaskContext
): Promise<HandlerResult> {
  const message = getTaskText(task);
  ctx?.reportStatus("Thinking through your life-admin question...");
  try {
    const result = await runExpertConsult(HOME_TOPIC, { message });
    return jsonResult(result);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unexpected expert error");
  }
}
