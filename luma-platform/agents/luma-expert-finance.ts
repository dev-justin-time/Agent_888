import { createExpertAgent, ExpertTopic } from "./lib/expert-core";

const FINANCE_TOPIC: ExpertTopic = {
  id: "finance",
  agentName: "luma_finance_expert",
  toolName: "consult_finance",
  description: "Plain-language money logic: budgeting, debt payoff strategy, savings, and spending decisions.",
  port: 8101,
  systemPrompt: `You are Luma's Money & Finance Logic expert — a calm, plain-speaking guide to financial literacy, not a financial advisor.
RULES:
1. NEVER give personalized financial advice, guaranteed returns, or specific investment picks. You share general, widely-taught financial literacy frameworks.
2. ALWAYS anchor your answer in the identified framework when one is provided. Use its steps verbatim as the skeleton.
3. Use plain language. No jargon without a one-line explanation. No shame, no judgment, no guilt — money struggles are universal.
4. If the user faces a decision that binds them (signing a loan, a contract, a big purchase, debt settlement), say clearly that a qualified professional should review it.
5. If the user may be in financial crisis (eviction, utilities shut-off, debt collectors, no food), end with: [ROUTE_TO_RESOURCES]
6. Tone: warm, grounded, honest about trade-offs. End with one gentle next step. Return ONLY valid JSON with keys "response" and "framework_used".`,
  disclaimer:
    "Luma's finance expert shares general financial-literacy frameworks, not personalized advice. For binding decisions, a qualified professional should review first.",
  frameworks: [
    {
      id: "50-30-20",
      name: "50/30/20 Budget",
      triggers: [
        "budget",
        "spending plan",
        "where does my money go",
        "save money",
        "run out of money",
        "paycheck to paycheck",
        "track spending",
      ],
      steps: [
        "Split your after-tax income into three buckets: 50% for needs (housing, food, utilities, minimum debt payments), 30% for wants (fun, dining, subscriptions), 20% for savings and extra debt payments.",
        "List your last month of spending and sort every expense into one of the three buckets — honesty over perfection.",
        "Fix the largest imbalance first (typically needs creeping past 50% or wants above 30%) with one concrete change this week.",
      ],
      caution:
        "The 50/30/20 split is a starting point, not a law — high-cost areas or low incomes may need a different ratio. The goal is awareness and direction, not an exact score.",
    },
    {
      id: "debt-avalanche-snowball",
      name: "Debt Payoff: Avalanche vs. Snowball",
      triggers: [
        "debt",
        "credit card",
        "loans",
        "pay off",
        "owe",
        "payments",
        "minimum payment",
        "interest",
      ],
      steps: [
        "List every debt with its balance, minimum payment, and interest rate.",
        "Choose a strategy: AVALANCHE — pay minimums on everything, then throw every extra dollar at the highest-interest debt (saves the most money); SNOWBALL — attack the smallest balance first (builds momentum and motivation).",
        "Pick the one you can actually sustain for months — consistency beats theoretical optimality.",
        "Keep a bare-bones emergency cushion (even $200–500) so one surprise bill doesn't derail the plan.",
      ],
      caution:
        "Both strategies work; the best one is the one you'll stick with. If a creditor is threatening legal action, do not ignore it — connect with free or low-cost support.",
    },
    {
      id: "emergency-fund",
      name: "Emergency Fund Ladder",
      triggers: [
        "emergency fund",
        "rainy day",
        "savings",
        "unexpected expense",
        "saved nothing",
        "car broke",
        "medical bill",
      ],
      steps: [
        "Start tiny: aim for one week of essential expenses ($200–500) as a shock absorber — this alone prevents most debt spirals.",
        "Automate a small, painless transfer on payday (even $10–20) so saving happens before spending.",
        "Grow toward 1 month, then 3–6 months of essentials over time — the ladder, not the destination, is the win.",
      ],
      caution:
        "An emergency fund is for genuine emergencies (job loss, urgent repairs), not for wants. If you're already in crisis, prioritize today's essentials first.",
    },
    {
      id: "impulse-24-hour",
      name: "The 24-Hour Rule for Spending",
      triggers: [
        "impulse",
        "spending too much",
        "buy things",
        "treat myself",
        "waste money",
        "online shopping",
        "shopping",
      ],
      steps: [
        "For any non-essential purchase, wait 24 hours before buying — put it in a cart or a note and walk away.",
        "Ask one question: 'If I had zero obligations, would I still want this?' — separate the want from the escape.",
        "If you still want it after 24 hours, budget for it deliberately (from the 30% 'wants' bucket) instead of guilt-buying.",
      ],
      caution:
        "Impulse spending is rarely about the item — it's often a signal of stress. Address the feeling once in a while and the spending eases on its own.",
    },
    {
      id: "bill-triage",
      name: "Bill Triage Under Pressure",
      triggers: [
        "bills",
        "utilities",
        "electric",
        "rent",
        "overdue",
        "missed payment",
        "can't pay",
        "shut off",
        "collections",
        "creditor",
      ],
      steps: [
        "Rank bills by consequence: housing, food, and heat/water first — then debt payments, then everything else.",
        "Call each provider BEFORE the due date: most utilities, lenders, and landlords have hardship programs, payment plans, or extensions. Asking early is the single highest-leverage move.",
        "Get any agreement in writing (email is fine) so there's no dispute later.",
        "If you're facing eviction or a shut-off notice, this is an urgent situation — connect with resources immediately.",
      ],
      caution:
        "Never skip housing, food, or heat to pay a credit card. And never pay a debt collector over the phone without verifying the debt in writing first.",
    },
  ],
};

createExpertAgent(FINANCE_TOPIC);
