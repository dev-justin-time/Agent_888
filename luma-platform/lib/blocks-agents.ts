import { TaskClient, textPart } from "@blocks-network/sdk";

/**
 * App-side consumer client for the Luma agents deployed on Blocks Network.
 * Replaces the old localhost HTTP proxy (lib/agent-client.ts). Server-side
 * only: the BLOCKS_API_KEY never leaves the Next.js server.
 */

export type BlocksBillingMode = "free" | "paid";

export interface BlocksAgentSpec {
  agentName: string;
  billingMode: BlocksBillingMode;
}

export const BLOCKS_AGENTS = {
  navigator: { agentName: "lumanation_navigator", billingMode: "paid" },
  resources: { agentName: "lumanation_resources", billingMode: "free" },
  community: { agentName: "lumanation_community", billingMode: "free" },
  escrow: { agentName: "lumanation_escrow_steward", billingMode: "paid" },
  outreach: { agentName: "lumanation_partner_architect", billingMode: "paid" },
  expert_finance: { agentName: "lumanation_expert_finance", billingMode: "paid" },
  expert_legal: { agentName: "lumanation_expert_legal", billingMode: "paid" },
  expert_career: { agentName: "lumanation_expert_career", billingMode: "paid" },
  expert_learning: { agentName: "lumanation_expert_learning", billingMode: "paid" },
  expert_home: { agentName: "lumanation_expert_home", billingMode: "paid" },
  expert_digital: { agentName: "lumanation_expert_digital", billingMode: "paid" },
  expert_wellbeing: { agentName: "lumanation_expert_wellbeing", billingMode: "paid" },
} as const satisfies Record<string, BlocksAgentSpec>;

const EXPERT_AGENT_BY_TOPIC: Record<string, BlocksAgentSpec> = {
  finance: BLOCKS_AGENTS.expert_finance,
  legal: BLOCKS_AGENTS.expert_legal,
  career: BLOCKS_AGENTS.expert_career,
  learning: BLOCKS_AGENTS.expert_learning,
  home: BLOCKS_AGENTS.expert_home,
  digital: BLOCKS_AGENTS.expert_digital,
  wellbeing: BLOCKS_AGENTS.expert_wellbeing,
};

export function getExpertAgent(topic: string): BlocksAgentSpec | undefined {
  return EXPERT_AGENT_BY_TOPIC[topic];
}

// Memoized per billing mode (free/playground vs paid/network keysets).
const clients = new Map<BlocksBillingMode, Promise<TaskClient>>();

function getClient(billingMode: BlocksBillingMode): Promise<TaskClient> {
  const apiKey = process.env.BLOCKS_API_KEY;
  if (!apiKey) {
    return Promise.reject(
      new Error("BLOCKS_API_KEY is not set — run `blocks login --write-env` and restart.")
    );
  }
  let pending = clients.get(billingMode);
  if (!pending) {
    pending = TaskClient.create({ billingMode, apiKey });
    clients.set(billingMode, pending);
  }
  return pending;
}

export interface BlocksCallResult {
  ok: boolean;
  payload?: unknown;
  error?: string;
}

/**
 * Send one message to a Blocks agent and return its first JSON artifact.
 * The handler returns JSON (mimeType application/json), which we parse.
 */
export async function callBlocksAgent(
  spec: BlocksAgentSpec,
  message: string,
  timeoutMs = 90_000
): Promise<BlocksCallResult> {
  try {
    const client = await getClient(spec.billingMode);
    const session = await client.sendMessage({
      agentName: spec.agentName,
      requestParts: [textPart(message, "request")],
    });

    const terminal = await session.waitForTerminal(timeoutMs);

    if (terminal.state !== "completed") {
      const reason = terminal.error || terminal.reason || terminal.state;
      session.close();
      return { ok: false, error: `Agent ${spec.agentName} ${reason}` };
    }

    const ref = session.listArtifacts()[0];
    if (!ref) {
      session.close();
      return { ok: false, error: `Agent ${spec.agentName} returned no result.` };
    }

    const artifact = await session.downloadArtifact(ref);
    const text = Buffer.from(artifact.data).toString("utf8");

    let payload: unknown = text;
    if (artifact.mimeType === "application/json" || text.trim().startsWith("{")) {
      try {
        payload = JSON.parse(text);
      } catch {
        // Keep raw text if it is not valid JSON.
      }
    }

    session.close();
    return { ok: true, payload };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Billing-mode mismatches and unregistered agents surface as RPC errors.
    return { ok: false, error: message };
  }
}
