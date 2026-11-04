import { WELLBEING_TOPIC } from "../../agents/lib/expert-topics.ts";
import { createExpertHandler } from "../shared/expert-handler.ts";

export default createExpertHandler(WELLBEING_TOPIC, "Listening with care...");
