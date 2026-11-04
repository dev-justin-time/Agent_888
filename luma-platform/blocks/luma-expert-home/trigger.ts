import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_expert_home";
const BILLING_MODE = "paid";
const TEST_MESSAGE = "I have bills piling up and I'm overwhelmed";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
