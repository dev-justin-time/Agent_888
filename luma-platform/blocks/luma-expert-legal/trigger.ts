import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_expert_legal";
const BILLING_MODE = "paid";
const TEST_MESSAGE = "My landlord is threatening to evict me — what are my rights?";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
