import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_community";
const BILLING_MODE = "free";
const TEST_MESSAGE = "{\"user_locale\":\"US-NY\",\"provider_type\":\"counselor\"}";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
