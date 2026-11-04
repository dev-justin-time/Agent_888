import { CAREER_TOPIC } from "../../agents/lib/expert-topics.ts";
import { createExpertHandler } from "../shared/expert-handler.ts";

export default createExpertHandler(CAREER_TOPIC, "Thinking through your career question...");
