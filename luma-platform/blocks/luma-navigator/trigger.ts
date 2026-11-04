import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_navigator";
const BILLING_MODE = "paid";
const TEST_MESSAGE = "I'm feeling completely overwhelmed by everything right now";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
