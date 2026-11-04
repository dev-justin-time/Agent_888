import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_expert_career";
const BILLING_MODE = "paid";
const TEST_MESSAGE = "I have an interview next week — how do I prepare?";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
