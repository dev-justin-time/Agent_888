import type { HandlerResult, StartTaskMessage } from "@blocks-network/sdk";

/** Extract the text payload from the task's first request part. */
export function getTaskText(task: StartTaskMessage): string {
  return task.requestParts?.[0]?.text ?? "";
}

/** Parse the first request part as JSON (for structured-input agents). */
export function parseTaskJson<T>(task: StartTaskMessage, fallback: T): T {
  const text = getTaskText(task);
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/** Wrap a result payload as a JSON artifact. */
export function jsonResult(payload: unknown): HandlerResult {
  return {
    artifacts: [{ data: JSON.stringify(payload), mimeType: "application/json" }],
  };
}

/**
 * Wrap a success payload as a JSON artifact. Luma's per-task billing field is
 * always zero (routes are local-first), so callers only describe their data.
 */
export function jsonSuccess(payload: Record<string, unknown>): HandlerResult {
  return jsonResult({ status: "success", billed_amount: 0, ...payload });
}

/** Wrap a failure as a JSON artifact with a standard error shape. */
export function jsonError(message: string): HandlerResult {
  return jsonResult({ status: "error", message, billed_amount: 0 });
}
