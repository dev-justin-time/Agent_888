import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_expert_learning";
const BILLING_MODE = "paid";
const TEST_MESSAGE = "I keep forgetting what I study — how do I actually remember things?";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
