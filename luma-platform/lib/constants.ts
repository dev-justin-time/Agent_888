export const NAV_ITEMS = [
  { id: "navigate", label: "Navigate", href: "/navigate" },
  { id: "resources", label: "Resources", href: "/resources" },
  { id: "community", label: "Community", href: "/community" },
  { id: "experts", label: "Experts", href: "/experts" },
  { id: "stewardship", label: "Stewardship", href: "/stewardship" },
] as const;

export const APP_NAME = "LumaNation";
export const TAGLINE = "A completely private, anonymous space to unpack your thoughts and navigate life's heavy days.";

export interface ExpertTopicMeta {
  id: string;
  label: string;
  tagline: string;
  /** lucide-react icon name key (mapped in UI). */
  icon: string;
  prompts: string[];
}

export const EXPERT_TOPICS: ExpertTopicMeta[] = [
  {
    id: "finance",
    label: "Money & Finance",
    tagline: "Budgeting, debt payoff strategy, and spending decisions in plain language.",
    icon: "wallet",
    prompts: [
      "I keep running out of money before payday — how do I budget?",
      "I have credit card debt and don't know where to start paying it off",
      "How do I build an emergency fund when I can barely save anything?",
    ],
  },
  {
    id: "legal",
    label: "Legal & Rights",
    tagline: "Understand your rights around housing, contracts, and consumer issues.",
    icon: "scale",
    prompts: [
      "My landlord is threatening to evict me — what are my rights?",
      "A store won't refund a defective product I bought",
      "What should I check before signing a contract?",
    ],
  },
  {
    id: "career",
    label: "Career & Work",
    tagline: "Interviews, negotiation, job search systems, and workplace navigation.",
    icon: "briefcase",
    prompts: [
      "I have an interview next week — how do I prepare?",
      "How do I negotiate a higher salary offer?",
      "I hate my job but don't know what else to do",
    ],
  },
  {
    id: "learning",
    label: "Learning & Education",
    tagline: "Study systems, focus, memory, and learning any new skill faster.",
    icon: "graduation-cap",
    prompts: [
      "I keep forgetting what I study — how do I actually remember things?",
      "I can't focus or stop procrastinating on my coursework",
      "I want to teach myself a new skill — where do I start?",
    ],
  },
  {
    id: "home",
    label: "Home & Life Admin",
    tagline: "Bills, insurance, paperwork, moving, and big life decisions.",
    icon: "home",
    prompts: [
      "I have bills piling up and I'm overwhelmed",
      "How do I actually understand my insurance plan?",
      "I'm moving next month — what do I need to do?",
    ],
  },
  {
    id: "digital",
    label: "Digital Safety",
    tagline: "Scam detection, phishing, account security, and privacy decisions.",
    icon: "shield-check",
    prompts: [
      "Is this message from my 'bank' a scam?",
      "I think I clicked a phishing link — what do I do?",
      "How do I protect my accounts with strong passwords?",
    ],
  },
  {
    id: "wellbeing",
    label: "Headspace & Well-being",
    tagline: "Gentle, story-based guidance for heavy days, overwhelm, and rest.",
    icon: "heart-pulse",
    prompts: [
      "I feel completely overwhelmed by everything right now",
      "Getting out of bed feels impossible today",
      "I can't say no to anyone and I'm drained",
    ],
  },
];

export const EXPERT_TOPIC_MAP: Record<string, ExpertTopicMeta> = Object.fromEntries(
  EXPERT_TOPICS.map((t) => [t.id, t])
);
