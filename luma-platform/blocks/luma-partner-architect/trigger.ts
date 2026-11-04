import { main } from "../shared/run-trigger.ts";

const AGENT_NAME = "lumanation_partner_architect";
const BILLING_MODE = "paid";
const TEST_MESSAGE = "{\"org_name\":\"OpenHeart Foundation\",\"org_type\":\"Foundation\",\"alignment_focus\":\"mental privacy and accessible support\",\"org_recent_initiative\":\"launched a youth support grant program\"}";

main({
  agentName: AGENT_NAME,
  billingMode: BILLING_MODE,
  testMessage: TEST_MESSAGE,
});
