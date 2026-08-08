import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import { runExpertConsult } from "../../agents/lib/expert-logic.ts";
import { LEARNING_TOPIC } from "../../agents/lib/expert-topics.ts";
import { getTaskText, jsonResult, jsonError } from "../shared/handler-utils.ts";

export default async function handler(
  task: StartTaskMessage,
  ctx?: TaskContext
): Promise<HandlerResult> {
  const message = getTaskText(task);
  ctx?.reportStatus("Thinking through your learning question...");
  try {
    const result = await runExpertConsult(LEARNING_TOPIC, { message });
    return jsonResult(result);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unexpected expert error");
  }
}
