import { createExpertAgent, ExpertTopic } from "./lib/expert-core";

const CAREER_TOPIC: ExpertTopic = {
  id: "career",
  agentName: "luma_career_expert",
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

createExpertAgent(CAREER_TOPIC);
