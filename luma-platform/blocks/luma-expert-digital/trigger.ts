import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_expert_digital";
const BILLING_MODE = "paid";
const TEST_MESSAGE = "Is this message from my 'bank' a scam?";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
