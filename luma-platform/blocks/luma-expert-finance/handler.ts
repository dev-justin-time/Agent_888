import { FINANCE_TOPIC } from "../../agents/lib/expert-topics.ts";
import { createExpertHandler } from "../shared/expert-handler.ts";

export default createExpertHandler(FINANCE_TOPIC, "Thinking through your money question...");
