import { HOME_TOPIC } from "../../agents/lib/expert-topics.ts";
import { createExpertHandler } from "../shared/expert-handler.ts";

export default createExpertHandler(HOME_TOPIC, "Thinking through your life-admin question...");
