import type { ExpertTopic } from "./expert-logic";

/**
 * All seven Luma expert topic configurations, in one place.
 * Imported by the deployed Blocks network handlers so each deployed
 * agent shares the exact same curated knowledge base.
 */

export const FINANCE_TOPIC: ExpertTopic = {
  id: "finance",
  agentName: "lumanation_expert_finance",
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

export const LEGAL_TOPIC: ExpertTopic = {
  id: "legal",
  agentName: "lumanation_expert_legal",
  toolName: "consult_legal",
  description: "Plain-language rights literacy: housing, consumer protections, workplace basics, and contracts.",
  port: 8102,
  systemPrompt: `You are Luma's Legal & Rights Logic expert — a plain-language guide to understanding your rights, not an attorney and not legal advice.
RULES:
1. You provide GENERAL rights literacy and practical steps, never legal advice, never predictions about outcomes, never jurisdiction-specific claims unless marked as common practice.
2. ALWAYS anchor your answer in the identified framework when one is provided.
3. Plain language. No intimidation. Rights are for everyone, and feeling powerless is exactly what abusers and bad actors count on.
4. Push gentle empowerment: document everything, get it in writing, and know that asking questions is always allowed.
5. If the situation is a live dispute (eviction, arrest, lawsuit, signed harmful contract), say clearly: consult a licensed attorney or free legal aid in your area, and include [ROUTE_TO_RESOURCES].
6. Tone: steady, respectful, practical. End with one concrete next step. Return ONLY valid JSON with keys "response" and "framework_used".`,
  disclaimer:
    "Luma's legal expert provides general rights literacy, not legal advice. For a live dispute, a licensed attorney or free legal aid in your area should be consulted.",
  frameworks: [
    {
      id: "rights-first-aid",
      name: "Rights First Aid: Document, Don't Sign, Get It Written",
      triggers: [
        "landlord",
        "tenant",
        "eviction",
        "security deposit",
        "lease",
        "roommate",
        "housing",
        "my rights",
      ],
      steps: [
        "DOCUMENT: keep every message, notice, receipt, and photo with dates. If it isn't written, write a short factual email summary ('Just confirming our call about...') — this creates the record you may need.",
        "DON'T SIGN UNDER PRESSURE: no one can force you to sign a lease, waiver, or agreement on the spot. Say 'I need time to review this' — that's always allowed, and the pause protects you.",
        "KNOW THE BIG THREE tenant basics (in most places): landlords must maintain habitability (working heat/water/locks), security deposits have rules about amount and return timelines, and evictions require proper written notice and a legal process — never a self-help lockout.",
      ],
      caution:
        "Housing law varies a lot by state/province and city. These are general patterns, not guarantees — for a live dispute, contact free legal aid in your area.",
    },
    {
      id: "consumer-protection",
      name: "Consumer Protections: Disputes, Refunds, Chargebacks",
      triggers: [
        "refund",
        "charge",
        "warranty",
        "scammed",
        "defective",
        "return",
        "store won't",
        "company won't",
        "billing error",
      ],
      steps: [
        "Open the paper trail: email the company a clear, calm request referencing the product/service, the issue, and what you want (refund, replacement, fix). Companies respond better to written, dated records.",
        "Escalate in order: customer service → manager → consumer protection agency (or small claims for smaller disputes). Keep every response.",
        "For credit card charges you didn't authorize, or goods/services never delivered, you can dispute the charge with your card issuer (a 'chargeback') — the issuer, not the merchant, investigates.",
      ],
      caution:
        "Chargebacks are a real but limited tool — they're for genuine disputes, and abusing them can backfire. Time limits often apply, so act early.",
    },
    {
      id: "workplace-basics",
      name: "Workplace Basics: Pay, Safety, and Fairness",
      triggers: [
        "boss",
        "fired",
        "terminated",
        "wage",
        "overtime",
        "harassed",
        "unfair",
        "workplace",
        "layoff",
        "furlough",
      ],
      steps: [
        "Check what you're owed first: most places require minimum wage, overtime for eligible hours, and pay stubs. Keep your own record of hours worked — your employer's record may not be the only one.",
        "Document any unfair treatment factually: dates, what happened, who was present, any messages. Written records are the backbone of every workplace claim.",
        "Report genuine safety hazards or harassment through official channels (HR, labor department, workplace safety authority) and know that retaliation for good-faith reporting is illegal in most places.",
      ],
      caution:
        "Employment law differs widely and 'at-will' employment means termination is often legal even when unfair. For discrimination or wage theft, consult your local labor authority or an employment attorney.",
    },
    {
      id: "contract-checklist",
      name: "The Plain-Language Contract Checklist",
      triggers: [
        "contract",
        "agreement",
        "sign",
        "terms",
        "fine print",
        "terms of service",
        "before i sign",
      ],
      steps: [
        "Read it cold: scan for the four money clauses — price/cost, payment timing, penalties for breaking it, and who pays for damages. Those four decide almost everything.",
        "Find the 'escape hatch': how each side can end the agreement, and what it costs. A contract you can't leave is a trap, no matter how good the rest looks.",
        "Watch for auto-renewal and hidden fees: 'renews automatically' and 'subject to additional fees' are the two most common buried clauses.",
        "Never sign a blank, partially-filled, or rush-you contract. Get changes in writing and initial every edit.",
      ],
      caution:
        "This checklist helps you understand a contract, but it is not a substitute for review by someone who knows the law — especially for large amounts or long commitments.",
    },
  ],
};

export const CAREER_TOPIC: ExpertTopic = {
  id: "career",
  agentName: "lumanation_expert_career",
  toolName: "consult_career",
  description: "Job-search systems, interview logic, negotiation preparation, and workplace navigation.",
  port: 8103,
  systemPrompt: `You are Luma's Career & Work Logic expert — a practical, encouraging guide to job search, interviews, and negotiation, with zero hustle-culture pressure.
RULES:
1. Your guidance is educational and strategy-based. Never promise outcomes, jobs, or salaries.
2. ALWAYS anchor your answer in the identified framework when one is provided.
3. Plain language. No guilt about gaps, rejections, or career changes — the job market is a system, not a verdict on a person.
4. Compensation and norms vary by industry, location, and market — say so rather than giving false precision.
5. If the user is in a genuinely harmful workplace situation, connect to resources rather than 'leaning in': [ROUTE_TO_RESOURCES]
6. Tone: calm, structured, human. End with one concrete next step. Return ONLY valid JSON with keys "response" and "framework_used".`,
  disclaimer:
    "Career guidance is educational. Salaries, norms, and processes vary by market and industry — verify against current local data before acting.",
  frameworks: [
    {
      id: "star-method",
      name: "STAR Method for Interviews",
      triggers: [
        "interview",
        "behavioral",
        "tell me about a time",
        "interview question",
        "interviewing",
        "screening",
      ],
      steps: [
        "SITUATION: set the scene in one or two sentences — what was the context and your role.",
        "TASK: name the specific problem or goal you owned.",
        "ACTION: describe what YOU did (not the team) in 2–3 concrete steps.",
        "RESULT: close with the outcome — a number, a change, or a lesson learned if the result was mixed.",
      ],
      caution:
        "Aim for 60–90 seconds per story. Prepare 3–4 STAR stories that cover teamwork, a mistake, a challenge, and a win — most behavioral questions map onto one of them.",
    },
    {
      id: "negotiation-batna",
      name: "Salary Negotiation with BATNA",
      triggers: [
        "salary",
        "negotiate",
        "offer",
        "raise",
        "pay",
        "compensation",
        "counter",
        "promotion",
      ],
      steps: [
        "RESEARCH: find the market range for the role in your location and level — from 3+ independent sources, not just one site. Your target range is the middle of that spread.",
        "BUILD YOUR BATNA (Best Alternative To Negotiated Agreement): know what you'll do if they say no — another offer, staying put, freelancing. A strong BATNA is what makes negotiation calm instead of desperate.",
        "ASK WITH THE RANGE: 'Based on my research and experience, I'm looking for X–Y. Can we discuss how that aligns with the budget?' Then stop talking — silence is your ally.",
        "Never accept a same-day, pressured deadline. 'I'd love to review the full details and get back to you tomorrow' is always acceptable.",
      ],
      caution:
        "Most negotiation happens in the first offer — and most people who simply ask for 10% more get closer to it. But never bluff a competing offer you don't have.",
    },
    {
      id: "job-search-system",
      name: "The Job Search System: Applications That Actually Move",
      triggers: [
        "apply",
        "job search",
        "resume",
        "cv",
        "cover letter",
        "unemployed",
        "hiring",
        "applications",
        "no interviews",
      ],
      steps: [
        "QUALITY OVER VOLUME: instead of 50 generic applications, send 10 targeted ones. Tailor the first 2 lines of your resume and the opening paragraph of your message to the specific posting.",
        "MATCH THE KEYWORDS: mirror the job description's exact language where you genuinely have that skill — applicant systems and humans both scan for it.",
        "FOLLOW UP ONCE: a short, friendly email 5–7 business days after applying is normal and often separates you from the pile.",
        "Run the funnel weekly: track applications sent → replies → interviews. If replies are near zero, change the resume, not the volume.",
      ],
      caution:
        "Rejections and silence are the default in this market, not a reflection of your worth. The system converts a small percentage — build a pipeline so no single outcome matters.",
    },
    {
      id: "networking-first",
      name: "Networking-First: Warm Doors Beat Cold Applications",
      triggers: [
        "network",
        "linkedin",
        "referral",
        "cold email",
        "connection",
        "informational interview",
        "reach out",
      ],
      steps: [
        "MAP your existing network: former coworkers, classmates, friends-of-friends in the industry. Warm intros convert far better than cold outreach.",
        "ASK FOR INSIGHT, NOT FAVORS: 'I'd love 15 minutes to hear about your path' outperforms 'Can you get me a job?' — and people genuinely enjoy being the expert.",
        "MAKE IT EASY TO SAY YES: propose a specific time, keep it to 15 minutes, prepare 3 questions, and thank them afterward with a brief update on your progress.",
      ],
      caution:
        "Most roles are never posted publicly — referral pipelines fill them first. Networking is a slow compounding skill; the best time to build it is before you need it.",
    },
    {
      id: "career-pivot",
      name: "The Career Pivot Framework",
      triggers: [
        "career change",
        "switch careers",
        "stuck",
        "what should i do",
        "burnout at work",
        "hate my job",
        "new career",
        "find my purpose",
      ],
      steps: [
        "AUDIT, don't guess: list what you're good at, what energizes you, what drains you, and what you'd need to earn. Overlap = the realistic target zone.",
        "PROTOTYPE cheaply: before quitting anything, test the new direction — a course, a freelance gig, a volunteer role, an informational interview with someone doing it daily.",
        "TRANSFER the assets: most pivots reuse 60–70% of existing skills. Name the transferable ones out loud — they're your bridge.",
        "Make one 30-minute move this week (a conversation, a class, a draft) — momentum beats a perfect 5-year plan.",
      ],
      caution:
        "Burnout can masquerade as a career problem. If everything feels impossible, address rest and wellbeing first — decisions made from empty reserves are rarely good ones.",
    },
  ],
};

export const LEARNING_TOPIC: ExpertTopic = {
  id: "learning",
  agentName: "lumanation_expert_learning",
  toolName: "consult_learning",
  description: "Learning science made practical: study systems, focus, memory, and skill acquisition.",
  port: 8104,
  systemPrompt: `You are Luma's Learning & Education Logic expert — a guide to the science of learning, delivered in plain, encouraging language.
RULES:
1. Anchor your answer in the identified framework when one is provided. Use its steps as the skeleton.
2. No shame about procrastination, memory, or 'being bad at school' — those are system problems, not character flaws, and you say so.
3. Evidence-based only: active recall, spaced repetition, interleaving, elaboration, retrieval practice. Never push 'learning styles' or gimmicks as proven.
4. If the user is studying for something high-stakes (exams, licensing, certification), encourage realistic scheduling over cramming.
5. Tone: warm, concrete, motivating. End with one 5-minute step they can do today. Return ONLY valid JSON with keys "response" and "framework_used".`,
  disclaimer:
    "Learning guidance is based on learning science, but results depend on consistency, subject matter, and your circumstances. No method is magic.",
  frameworks: [
    {
      id: "active-recall-spaced",
      name: "Active Recall + Spaced Repetition",
      triggers: [
        "memorize",
        "remember",
        "forget",
        "study",
        "exam",
        "test",
        "cram",
        "retain",
        "remembering",
      ],
      steps: [
        "TEST instead of re-read: close the book and force yourself to recall the material from memory (write it, say it, quiz yourself). Struggling to recall is the workout — it's working.",
        "Schedule re-tests at expanding gaps: 1 day → 3 days → 1 week → 2 weeks. Each successful recall pushes the memory further out.",
        "Turn notes into questions ('What does X do?') and answer them from memory the next day. Question banks and flashcards do this automatically.",
      ],
      caution:
        "Re-reading and highlighting feel productive but are the weakest learning methods — they're fluency without retrieval. If you can't recall it without looking, you haven't learned it yet.",
    },
    {
      id: "feynman-technique",
      name: "The Feynman Technique",
      triggers: [
        "understand",
        "confused",
        "concept",
        "explain",
        "stuck on",
        "doesn't make sense",
        "understand this",
      ],
      steps: [
        "Pick the concept and explain it in plain language as if teaching a smart 12-year-old — no jargon allowed.",
        "Find the exact spot where your explanation breaks down or gets vague — that gap is precisely what you don't understand yet.",
        "Go back to the source for ONLY that gap, then re-explain the whole thing until it flows without notes.",
      ],
      caution:
        "The moment your explanation gets hand-wavy is the diagnosis. Most 'I don't get it' is really 'I can't explain step 3 yet' — and that's very fixable.",
    },
    {
      id: "focus-pomodoro",
      name: "Focus Blocks: Start Small, Protect Momentum",
      triggers: [
        "focus",
        "procrastinate",
        "distracted",
        "concentrate",
        "get started",
        "motivation",
        "can't start",
      ],
      steps: [
        "SHRINK the start: commit to just 5 minutes of the task. Starting is the entire battle — momentum usually carries you past the timer.",
        "Work in focused blocks (e.g., 25 minutes on, 5 off) with the phone in another room and one single task visible.",
        "After each block, write the NEXT action in 10 words or less ('Open page 42, do problem 3'). A written next step removes tomorrow's friction.",
      ],
      caution:
        "Procrastination is usually a task problem (too big, too vague, too scary), not a willpower problem. Shrink the task until starting is easy, and the focus follows.",
    },
    {
      id: "interleaving",
      name: "Interleaving: Mix It to Master It",
      triggers: [
        "practice",
        "skills",
        "learn faster",
        "get better",
        "practice problems",
        "drills",
      ],
      steps: [
        "Mix related topics in one practice session instead of grinding one type of problem for an hour — e.g., alternate between question types you find easy and hard.",
        "Spacing forces your brain to choose the right strategy each time, which is the actual skill being tested.",
        "Keep a running list of the mistakes you made while mixing — your next session starts by re-testing those specific misses.",
      ],
      caution:
        "Interleaving feels harder and slower than blocked practice — that discomfort is the signal it's working. It shines on tests that mix topics, which is most real ones.",
    },
    {
      id: "learn-how-to-learn",
      name: "The Skill Acquisition Ladder",
      triggers: [
        "learn",
        "new skill",
        "teach myself",
        "course",
        "learn to code",
        "start learning",
        "where do i start",
      ],
      steps: [
        "PICK a concrete end goal, not a topic: 'build a landing page' beats 'learn web development' — the goal defines the curriculum.",
        "Build the minimum path: find ONE course/book/project that takes you from zero to that goal. Ignore the other 40 tabs. Depth of one path beats breadth of many.",
        "Do 80/20 practice: spend most of your time building/making with the skill, not consuming content about it.",
        "Ship something small publicly or to a friend by week one — a real output beats 'finishing the course' as a milestone.",
      ],
      caution:
        "Tutorial paralysis (endless courses, no doing) is the #1 reason learning stalls. Any project you start from day one outlearns a passive learner.",
    },
  ],
};

export const HOME_TOPIC: ExpertTopic = {
  id: "home",
  agentName: "lumanation_expert_home",
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

export const DIGITAL_TOPIC: ExpertTopic = {
  id: "digital",
  agentName: "lumanation_expert_digital",
  toolName: "consult_digital",
  description: "Online judgment: scam detection, phishing, account security, and privacy decisions.",
  port: 8106,
  systemPrompt: `You are Luma's Digital & Online Safety Logic expert — a clear-headed guide to staying safe online, with zero victim-blaming.
RULES:
1. Getting scammed or hacked is NEVER the victim's fault — scammers are professionals and systems are built to confuse. State this when relevant.
2. Anchor your answer in the identified framework when one is provided.
3. Give concrete, action-oriented steps (what to click, what to say, who to contact) — never vague warnings.
4. If money may already have been sent, or identity data exposed, escalate urgency: report to the platform/bank/authorities immediately, and include [ROUTE_TO_RESOURCES].
5. Tone: calm, sharp, empowering. End with one specific action. Return ONLY valid JSON with keys "response" and "framework_used".`,
  disclaimer:
    "Luma's digital expert gives general online-safety guidance. For active fraud or identity theft, always contact the official platform, your bank, and local authorities.",
  frameworks: [
    {
      id: "scam-red-flags",
      name: "The Five Scam Red Flags",
      triggers: [
        "scam",
        "fraud",
        "too good to be true",
        "wire",
        "gift card",
        "lottery",
        "inheritance",
        "prince",
        "crypto investment",
        "stranger asking",
        "suspicious",
      ],
      steps: [
        "URGENCY: 'Act now or lose it forever' is the #1 tool of every scam. Real institutions don't create panicked deadlines.",
        "PAYMENT METHOD: gift cards, wire transfers, crypto, or payment apps for a 'fee', 'deposit', or 'taxes' = a scam. No legitimate entity demands those.",
        "IMPERSONATION: anyone claiming to be your bank, government, or a loved one in crisis — hang up and call the OFFICIAL number yourself. Do not call back the number they gave.",
        "TOO GOOD TO BE TRUE: prizes, jobs paying absurdly for simple work, and investment 'guarantees' are fishing lines. If it were real, you wouldn't have found it in a random message.",
        "PRIVACY ASK: being asked to 'verify' your password, PIN, or 2FA code with anyone — ever — is an instant stop signal. No one legitimate asks for these.",
      ],
      caution:
        "If money was already sent or sent in a way you can't reverse, act within minutes: contact your bank, the payment platform, and your local fraud authority. Speed is the only edge.",
    },
    {
      id: "phishing-check",
      name: "The 30-Second Phishing Check",
      triggers: [
        "phishing",
        "email",
        "text message",
        "link",
        "bank asking",
        "verify account",
        "suspicious message",
        "clicked a link",
      ],
      steps: [
        "CHECK THE SENDER: look at the actual email address or number, not the display name. One wrong character (rnicrosoft.com) is the tell.",
        "LOOK FOR THE SQUEEZE: urgency ('account will be closed'), fear ('suspicious activity'), or prizes. Legitimate messages are boring and specific.",
        "NEVER CLICK — NAVIGATE: instead of clicking any link, open the official app or type the official website yourself and log in there.",
        "If you already clicked and entered credentials: change that password immediately (and any site using the same one), enable 2FA, and watch for unusual activity.",
      ],
      caution:
        "One bad click is not a disaster if you act fast. Changing the password and enabling two-factor authentication within the hour closes almost every hole a click opens.",
    },
    {
      id: "account-security",
      name: "Account Security: Passwords + 2FA",
      triggers: [
        "password",
        "hacked",
        "account",
        "two-factor",
        "security",
        "compromised",
        "login",
        "breach",
      ],
      steps: [
        "UNIQUE PASSWORDS: one password per account — when one site leaks, attackers try that password everywhere (this is how most 'hacks' happen).",
        "USE A PASSWORD MANAGER: it generates and remembers long unique passwords for you; the only password you need to memorize is the manager's master key.",
        "TURN ON 2FA (two-factor authentication) on email, banking, and anything with your card or identity — an app-based code or hardware key beats SMS texts.",
        "Check https://haveibeenpwned.com with your email — it shows which breaches exposed your data so you know which passwords to rotate.",
      ],
      caution:
        "Email is the master key — whoever controls your email can reset almost every other account. Secure it first, with 2FA, before anything else.",
    },
    {
      id: "privacy-decisions",
      name: "The Privacy Decision Framework",
      triggers: [
        "privacy",
        "data",
        "tracking",
        "permissions",
        "share my info",
        "app asking",
        "location",
        "cookies",
        "personal data",
      ],
      steps: [
        "ASK 'WHY DOES IT NEED THIS?': a calculator app does not need your contacts, a flashlight does not need your location. Permission requests that don't match the function are the signal to say no.",
        "DENY BY DEFAULT: install new apps with permissions off and grant them only when a feature genuinely requires it — you can always allow later.",
        "Review quarterly: settings → privacy/permissions — revoke anything unused, and log out of devices you no longer use.",
        "For accounts you no longer use: close them rather than abandon them — abandoned accounts are data dumps waiting to leak.",
      ],
      caution:
        "Privacy is a series of small, boring choices — and that's why it works. You don't need to be paranoid; you need to be deliberate.",
    },
    {
      id: "malware-response",
      name: "Malware & Ransomware Response",
      triggers: [
        "virus",
        "ransomware",
        "malware",
        "popup",
        "locked my computer",
        "files encrypted",
        "antivirus",
      ],
      steps: [
        "DISCONNECT: if you see ransomware ('your files are encrypted, pay to unlock'), disconnect from the network immediately — it limits the spread, including to backups.",
        "DON'T PAY: paying ransoms funds crime and doesn't guarantee decryption. The FBI and security firms advise against it.",
        "RESTORE from a clean backup if you have one (this is why offline backups matter), then run a reputable scanner to clear any remnants.",
        "Change passwords from a clean device and enable 2FA on anything important.",
      ],
      caution:
        "If you can't restore from backup, professional data-recovery help exists, but the priority is containment, then recovery, then prevention. Report it to authorities if demanded or if sensitive data is involved.",
    },
  ],
};

export const WELLBEING_TOPIC: ExpertTopic = {
  id: "wellbeing",
  agentName: "lumanation_expert_wellbeing",
  toolName: "consult_wellbeing",
  description: "Gentle, evidence-based care for your headspace: overwhelm, heavy days, rest, and grounding.",
  port: 8107,
  systemPrompt: `You are Luma's Headspace & Well-being expert — a gentle guide for heavy days, using story-based, non-clinical exploration.
RULES:
1. NEVER use clinical terms (mental health, anxiety, depression, therapy, symptoms, disorder, diagnosis). Use words like headspace, heavy days, emotional weather, finding your footing, unpacking, well-being.
2. NEVER diagnose, label, or tell the user what they are feeling. Use the "I know someone..." third-person storytelling method.
3. ALWAYS ground your answer in the identified framework when one is provided (brain dump, micro-step, lower the bar, sensory shifting, soft no, energy audit, safe person, grounding).
4. Provide 2-3 distinct approaches and the REALISTIC, non-magical outcome of each. Never promise a cure.
5. Keep the tone warm, validating, strictly non-judgmental. End with a gentle, open-ended question.
6. If the user seems in crisis or needs professional support, output the exact string: [ROUTE_TO_RESOURCES]
7. Return ONLY valid JSON with keys "response" and "framework_used".`,
  disclaimer:
    "Luma's well-being expert is a supportive space for exploring your headspace — not a medical professional and not a crisis service. For immediate help, use the hotline resources.",
  frameworks: [
    {
      id: "overwhelm",
      name: "The Brain Dump & Micro-Step",
      triggers: [
        "overwhelmed",
        "can't stop thinking",
        "racing",
        "too much to do",
        "spinning",
        "paralyzed",
        "everything at once",
        "too many tabs",
      ],
      steps: [
        "THE BRAIN DUMP: write every looping thought down, no matter how small, to get it out of your head and onto a page. It doesn't solve the tasks — it clears the mental RAM so you can breathe.",
        "THE 5-MINUTE MICRO-STEP: pick the smallest, most ridiculous task (put one dish in the sink, open one tab) and set a timer for 5 minutes. Starting breaks the paralysis; momentum carries the rest.",
        "RADICAL ACCEPTANCE: say out loud, 'I am completely overwhelmed right now, and that is okay.' Fighting the feeling burns more energy than the tasks themselves.",
      ],
      caution:
        "These approaches clear space and reduce pressure — they don't erase the situation. If the overwhelm is constant and heavy, it's a signal that human support would help.",
    },
    {
      id: "heavy-days",
      name: "Lowering the Bar to the Floor",
      triggers: [
        "tired",
        "no energy",
        "can't get out of bed",
        "heavy",
        "gray",
        "numb",
        "nothing matters",
        "no motivation",
      ],
      steps: [
        "LOWER THE BAR TO THE FLOOR: stop aiming for a 'good day' and aim for a 'neutral day' — one glass of water and a change of socks is a complete success. Removing the pressure to be fixed dissolves the guilt.",
        "SENSORY SHIFTING: when the gray sets in, change your physical input — step outside for 2 minutes, hold an ice cube, play one song you love at full volume. This gently interrupts the freeze response.",
        "REFRAE REST AS REQUIREMENT: treat rest as a biological need like breathing, not a reward for productivity. Resting when heavy isn't failing — it's maintenance.",
      ],
      caution:
        "This eases the weight of a heavy season; it is not a fix for a heavy season that won't lift. If the gray stays for weeks or thoughts turn dark, reaching for human support is the strong move.",
    },
    {
      id: "social-battery",
      name: "The Soft No & Energy Audit",
      triggers: [
        "drained",
        "can't say no",
        "people pleaser",
        "performing",
        "masking",
        "hiding",
        "drained by people",
        "guilt saying no",
      ],
      steps: [
        "THE SOFT NO: practice 'I'd love to, but my plate is completely full right now' — no fake excuse, no over-apology. The world won't end; people actually respect clear boundaries.",
        "THE ENERGY AUDIT: look at your calendar and ask, 'If I had zero obligations, would I still choose this?' Slowly drop the 'no' items. Reclaimed time is energy for the things you truly care about.",
        "FIND A SAFE PERSON: identify one person you can be 100% unfiltered with — no masking, no performing. One unmasked space gives your system somewhere real to recover.",
      ],
      caution:
        "Protecting your energy isn't selfish; it's necessary. Boundary-setting gets easier with practice, and the first few 'soft nos' are always the hardest.",
    },
    {
      id: "rest-sleep",
      name: "Rest & Sleep Hygiene Basics",
      triggers: [
        "sleep",
        "can't sleep",
        "insomnia",
        "rest",
        "exhausted",
        "wired",
        "3am",
        "tired all day",
      ],
      steps: [
        "ANCHOR THE WAKE TIME: keep a consistent wake-up time even after bad nights — it's the single strongest lever for resetting sleep, more than bedtime.",
        "WIND DOWN RITUAL: 30–60 minutes before bed, dim the lights, put the phone away, and do one calm, boring activity. Screen light and scrolling are the two biggest sleep thieves.",
        "THE 20-MINUTE RULE: if you're awake in bed past ~20 minutes, get up and do something calm in dim light until sleepy — staying in bed while awake trains your brain that bed = frustration.",
      ],
      caution:
        "Sleep is affected by stress, caffeine, screens, and schedules — improve those before assuming something deeper is wrong. If exhaustion is severe or long-lasting, it deserves professional input.",
    },
    {
      id: "grounding",
      name: "Sensory Grounding (5-4-3-2-1)",
      triggers: [
        "ground",
        "panic",
        "panicking",
        "racing heart",
        "shaking",
        "flashback",
        "freaking out",
        "can't breathe",
        "spiral",
      ],
      steps: [
        "NAME 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste — out loud or in your head, slowly. This pulls attention out of the spiral and into the present room.",
        "BREATHE SLOW: in for 4 counts, hold for 4, out for 6. Longer exhales tell the nervous system it's safe to downshift.",
        "PRESS SOMETHING COLD: hold an ice cube or splash cold water on your face — a sharp physical sensation interrupts a racing loop better than any pep talk.",
      ],
      caution:
        "Grounding calms an intense moment; it doesn't address what's underneath. Frequent intense episodes are a clear sign to connect with a human professional who can help.",
    },
  ],
};


