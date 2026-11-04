import "dotenv/config";
import { TaskClient, textPart } from "@blocks-network/sdk";

export interface TriggerConfig {
  /** Deployed Blocks agent name, e.g. "lumanation_navigator". */
  agentName: string;
  /** Billing mode the agent was published with. */
  billingMode: "free" | "paid";
  /** Sample payload sent as the task's single request part. */
  testMessage: string;
}

const TERMINAL_TIMEOUT_MS = 90_000;

/**
 * Send one test task to a deployed agent and print its progress, terminal
 * state, and artifacts. Shared by every `blocks/<agent>/trigger.ts`; those
 * files only carry the per-agent config.
 */
export async function runTrigger({
  agentName,
  billingMode,
  testMessage,
}: TriggerConfig): Promise<void> {
  const client = await TaskClient.create({
    billingMode,
    apiKey: process.env.BLOCKS_API_KEY,
  });
  console.log(`Sending task to ${agentName} (${billingMode})...`);
  const session = await client.sendMessage({
    agentName,
    requestParts: [textPart(testMessage, "request")],
  });
  session.onProgress((e) => console.log("Progress:", e.message));
  const terminal = await session.waitForTerminal(TERMINAL_TIMEOUT_MS);
  console.log("Done:", terminal.state);
  if (terminal.state !== "completed") {
    console.log("Reason:", terminal.error || terminal.reason || "");
  }
  for (const ref of session.listArtifacts()) {
    const artifact = await session.downloadArtifact(ref);
    console.log("Artifact:", Buffer.from(artifact.data).toString("utf8"));
  }
  session.close();
  client.destroy();
}

/** Script entry point: run the trigger, exiting non-zero on failure. */
export function main(config: TriggerConfig): void {
  runTrigger(config).catch((err) => {
    console.error("Trigger failed:", err);
    process.exit(1);
  });
}
