import { createExpertAgent, ExpertTopic } from "./lib/expert-core";

const HOME_TOPIC: ExpertTopic = {
  id: "home",
  agentName: "luma_home_expert",
  toolName: "consult_home",
  description: "Practical life administration: bills, insurance basics, paperwork, moves, and big decisions.",
  port: 8105,
  systemPrompt: `You are Luma's Home & Life Admin Logic expert — the calm, organized friend who helps adults run their lives without shame.
RULES:
1. Anchor your answer in the identified framework when one is provided.
2. Plain language. Never make people feel stupid for not knowing adult admin — no one teaches this stuff and everyone fakes it.
3. Insurance, tax, and jurisdiction-specific rules: give general patterns and ALWAYS flag that specifics depend on policy and location.
4. If the user is in a hardship situation (can't pay rent, utilities shut-off, lost documents that block housing/jobs), include [ROUTE_TO_RESOURCES].
5. Tone: steady, warm, systematic. End with one tiny concrete step. Return ONLY valid JSON with keys "response" and "framework_used".`,
  disclaimer:
    "Luma's home expert gives general life-administration guidance. Insurance, tax, and legal specifics depend on your policy, jurisdiction, and situation.",
  frameworks: [
    {
      id: "bill-triage",
      name: "Bill Triage & Payment System",
      triggers: [
        "bills",
        "utilities",
        "electric",
        "rent",
        "overdue",
        "missed payment",
        "can't pay",
        "shut off",
        "late fee",
        "due date",
      ],
      steps: [
        "LIST every recurring bill with its due date and minimum amount — one honest list beats the anxiety of 'somewhere in the pile'.",
        "RANK by consequence: housing, utilities, and food first; subscriptions and non-essentials last. Pay in that order.",
        "AUTOMATE what you can: autopay or calendar reminders 3 days before each due date. Late fees are a silent tax.",
        "Call providers BEFORE the due date if money is tight — hardship plans, extensions, and waivers exist but must be requested.",
      ],
      caution:
        "Never pay a bill you're unsure is real (verify first), and never let a single missed bill spiral into silence — one 5-minute phone call can usually stop the spiral.",
    },
    {
      id: "30-day-rule",
      name: "The 30-Day Rule for Big Purchases & Decisions",
      triggers: [
        "buy",
        "purchase",
        "expensive",
        "car",
        "big decision",
        "should i",
        "upgrade",
        "lease",
        "loan for",
      ],
      steps: [
        "For anything over your 'significant purchase' line, wait 30 days before committing. Write the decision and its cost where you'll see it daily.",
        "Research the TOTAL cost of ownership — purchase price + interest + maintenance + insurance — not just the sticker.",
        "After 30 days, re-decide from a written pro/con list with real numbers. If it's still right, it'll survive the pause.",
      ],
      caution:
        "Deals that expire today are pressure tactics. No legitimate opportunity evaporates because you took a month to think.",
    },
    {
      id: "insurance-basics",
      name: "Insurance Basics: Read the Four Numbers",
      triggers: [
        "insurance",
        "health plan",
        "deductible",
        "coverage",
        "policy",
        "premium",
        "copay",
        "out of pocket",
      ],
      steps: [
        "Find the four numbers on any policy: PREMIUM (monthly cost), DEDUCTIBLE (you pay this before coverage kicks in), COPAY (per-visit cost), and OUT-OF-POCKET MAX (the ceiling on what you can owe in a year).",
        "Know the difference that matters most: the deductible — a 'low premium' plan can mean a huge deductible you must pay first.",
        "Before any big care or claim, ask the provider: 'Is this covered, and what will my cost be?' in writing if possible.",
      ],
      caution:
        "Insurance networks, formularies, and rules change yearly. Re-read your plan's summary at renewal — the policy you think you have may not be the one in force.",
    },
    {
      id: "move-checklist",
      name: "The Moving & Transition Checklist",
      triggers: [
        "moving",
        "relocate",
        "new apartment",
        "new city",
        "moving out",
        "move in",
        "relocation",
      ],
      steps: [
        "Two weeks out: forward mail, notify utilities (set a transfer/start date), and confirm the lease terms in writing — move-in date, deposit, and condition report.",
        "One week out: photograph the old place's condition (for deposit disputes) and label every box by room and 'open first'.",
        "Move-in day: walk through the new place and document existing damage WITHIN the allowed window (usually a few days) — this is what protects your deposit.",
        "After the move: update your address on bank, ID, and subscription accounts — do the top 5, not everything, in one sitting.",
      ],
      caution:
        "Read the lease's move-out and notice clauses BEFORE you sign. The two most common deposit-killers are unphotographed pre-existing damage and missed move-out notice windows.",
    },
    {
      id: "document-system",
      name: "The Paperwork System: Keep the Right 10",
      triggers: [
        "paperwork",
        "documents",
        "records",
        "keep track",
        "organize",
        "files",
        "passport",
        "taxes",
        "lost documents",
      ],
      steps: [
        "Keep a single 'Life File' (physical or cloud) with the top 10: ID/passport, birth certificate, Social Security or national ID, bank accounts, insurance policies, lease/mortgage, employment records, tax records, medical records, and wills/beneficiary forms.",
        "Store IDs in two places: one physical secure spot + one encrypted cloud copy (or trusted person) — lost documents block housing, jobs, and benefits.",
        "Set one recurring calendar day per year ('Paperwork Day') to re-file, shred, and update anything that changed.",
      ],
      caution:
        "Keep tax-related records for at least 3–7 years depending on your jurisdiction; keep documents that prove identity and eligibility (birth, citizenship, military) forever.",
    },
  ],
};

createExpertAgent(HOME_TOPIC);
