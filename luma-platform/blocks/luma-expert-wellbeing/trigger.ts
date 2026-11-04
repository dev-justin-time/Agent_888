import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_expert_wellbeing";
const BILLING_MODE = "paid";
const TEST_MESSAGE = "Getting out of bed feels impossible today";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
