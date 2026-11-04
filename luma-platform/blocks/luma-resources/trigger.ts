import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_resources";
const BILLING_MODE = "free";
const TEST_MESSAGE = "{\"locale\":\"US\",\"need\":\"hotline\"}";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
