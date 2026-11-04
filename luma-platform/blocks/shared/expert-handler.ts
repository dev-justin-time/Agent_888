import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import { runExpertConsult } from "../../agents/lib/expert-logic.ts";
import type { ExpertTopic } from "../../agents/lib/expert-logic.ts";
import { getTaskText, jsonResult, jsonError } from "./handler-utils.ts";

/**
 * Build the Blocks handler for a Luma expert agent. Every expert runs the same
 * consult pipeline (`runExpertConsult`) and differs only in its curated topic
 * and the progress line reported while it thinks.
 */
export function createExpertHandler(topic: ExpertTopic, statusMessage: string) {
  return async function handler(
    task: StartTaskMessage,
    ctx?: TaskContext
  ): Promise<HandlerResult> {
    const message = getTaskText(task);
    ctx?.reportStatus(statusMessage);
    try {
      const result = await runExpertConsult(topic, { message });
      return jsonResult(result);
    } catch (error) {
      return jsonError(error instanceof Error ? error.message : "Unexpected expert error");
    }
  };
}
