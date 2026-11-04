import { LEARNING_TOPIC } from "../../agents/lib/expert-topics.ts";
import { createExpertHandler } from "../shared/expert-handler.ts";

export default createExpertHandler(LEARNING_TOPIC, "Thinking through your learning question...");
