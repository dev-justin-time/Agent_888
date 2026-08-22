export type {
  TopCall,
  ResourceCall,
  CommunityCall,
  EscrowCall,
  OutreachCall,
} from "./types.ts";

import type { TopCall } from "./types.ts";
import { FINANCE_TOP_CALLS } from "./finance.ts";
import { LEGAL_TOP_CALLS } from "./legal.ts";
import { CAREER_TOP_CALLS } from "./career.ts";
import { LEARNING_TOP_CALLS } from "./learning.ts";
import { HOME_TOP_CALLS } from "./home.ts";
import { DIGITAL_TOP_CALLS } from "./digital.ts";
import { WELLBEING_TOP_CALLS } from "./wellbeing.ts";
import { NAVIGATOR_TOP_CALLS } from "./navigator.ts";
import { RESOURCES_TOP_CALLS } from "./resources.ts";
import { COMMUNITY_TOP_CALLS } from "./community.ts";
import { ESCROW_TOP_CALLS } from "./escrow.ts";
import { OUTREACH_TOP_CALLS } from "./outreach.ts";

export {
  FINANCE_TOP_CALLS,
  LEGAL_TOP_CALLS,
  CAREER_TOP_CALLS,
  LEARNING_TOP_CALLS,
  HOME_TOP_CALLS,
  DIGITAL_TOP_CALLS,
  WELLBEING_TOP_CALLS,
  NAVIGATOR_TOP_CALLS,
  RESOURCES_TOP_CALLS,
  COMMUNITY_TOP_CALLS,
  ESCROW_TOP_CALLS,
  OUTREACH_TOP_CALLS,
};

/**
 * The 7 expert topic libraries, keyed by expert id ("finance", "legal", ...).
 * Consumed by the deterministic matching logic (agents/lib/expert-logic.ts)
 * so a user message matching a top call boosts its best-fit framework.
 */
export const TOP_CALLS_BY_EXPERT: Record<string, TopCall[]> = {
  finance: FINANCE_TOP_CALLS,
  legal: LEGAL_TOP_CALLS,
  career: CAREER_TOP_CALLS,
  learning: LEARNING_TOP_CALLS,
  home: HOME_TOP_CALLS,
  digital: DIGITAL_TOP_CALLS,
  wellbeing: WELLBEING_TOP_CALLS,
};
