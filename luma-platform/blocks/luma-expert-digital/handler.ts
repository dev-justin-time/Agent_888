import { DIGITAL_TOPIC } from "../../agents/lib/expert-topics.ts";
import { createExpertHandler } from "../shared/expert-handler.ts";

export default createExpertHandler(DIGITAL_TOPIC, "Thinking through your digital safety question...");
