import { LEGAL_TOPIC } from "../../agents/lib/expert-topics.ts";
import { createExpertHandler } from "../shared/expert-handler.ts";

export default createExpertHandler(LEGAL_TOPIC, "Thinking through your rights question...");
