import { Agent } from "@blocks-network/sdk";
import { ConsultInput, ExpertTopic, runExpertConsult } from "./expert-logic";

export * from "./expert-logic";

/**
 * Wraps the pure expert logic (see expert-logic.ts) into a Blocks-network
 * Agent. Kept in its own file so the deterministic brain stays SDK-independent
 * and unit-testable without the agent runtime.
 */
export function createExpertAgent(topic: ExpertTopic): void {
  const agent = new Agent({
    name: topic.agentName,
    description: topic.description,
    pricing: { type: "per-task", amount: 0, currency: "USD" },
  });

  agent.registerTool({
    name: topic.toolName,
    description: topic.description,
    handler: (input: ConsultInput) => runExpertConsult(topic, input),
  });

  agent.start({ port: topic.port });
  console.log(`🧠 ${topic.agentName} running on port ${topic.port}`);
}
