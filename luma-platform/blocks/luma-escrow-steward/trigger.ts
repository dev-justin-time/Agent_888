import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_escrow_steward";
const BILLING_MODE = "paid";
const TEST_MESSAGE = "{\"donor_name\":\"OpenHeart Foundation\",\"donor_type\":\"Foundation\",\"amount\":5000,\"currency\":\"USD\",\"specific_use_case\":\"\",\"prefer_general_purpose\":true,\"open_to_growth_strategy\":true}";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
