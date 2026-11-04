import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_expert_finance";
const BILLING_MODE = "paid";
const TEST_MESSAGE = "I keep running out of money before payday — how do I budget?";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
