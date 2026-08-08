import OpenAI from "openai";
import { TOP_CALLS_BY_EXPERT } from "../../data/top-calls/index.ts";

// Lazily created so the agent process can start and stay connected even when
// the API key is missing — tasks then fail gracefully instead of crashing the
// whole agent on startup.
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  _openai ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

/**
 * ────────────────────────────────────────────────────────────────────────────
 * LUMA EXPERT LOGIC — the SDK-independent brain shared by every Luma expert.
 *
 * Every expert runs the same industry-leading pipeline:
 *
 *   1. URGENT SAFETY SCREENING   → crisis signals return an immediate human
 *      hotline response, free of charge, before anything else runs.
 *   2. CONTINUITY PROTOCOL       → users stepping away are met with a gentle
 *      anchor, never left hanging.
 *   3. DETERMINISTIC FRAMEWORKS  → the message is matched against a curated,
 *      evidence-based knowledge base. The best-fit framework becomes the
 *      scaffold for the answer — guaranteed structure, independent of the LLM.
 *   4. LLM ENRICHMENT            → a strictly aligned model turns the scaffold
 *      into warm, plain-language guidance (structured JSON output).
 *   5. GUARANTEED FALLBACK       → if the model is unavailable, the matched
 *      framework is answered deterministically. An expert NEVER fails silently.
 *   6. RESOURCE ROUTING          → financial/legal/professional needs emit a
 *      [ROUTE_TO_RESOURCES] signal so the app can hand the user to support.
 * ────────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────── 1. Safety rails ────────────────────────────────

export const CRISIS_KEYWORDS =
  /\b(suicide|suicidal|kill myself|end it all|end my life|end my suffering|want to die|don'?t want to wake up|no reason to live|can'?t go on|can'?t take this anymore|self[- ]harm|cutting|hurt myself|don'?t want to be here|give up on life|take my life)\b/i;

export const CRISIS_RESPONSE = {
  status: "success",
  priority: "URGENT_SAFETY_PROTOCOL",
  response:
    "💙 Hey — I hear how much pain you're in right now, and I'm so glad you reached out. You do not have to carry this alone. Please connect with a human who can help immediately:\n\n" +
    "🇺🇸 US: Call or text **988**\n" +
    "🇬🇧 UK: Call **111** or text SHOUT to **85258**\n" +
    "🇨🇦 Canada: Call or text **988**\n" +
    "🌍 International: https://www.findahelpline.com\n\n" +
    "Please stay safe. Your life has value, even if it doesn't feel like it right now.",
  route_to_resources: true,
  billed_amount: 0,
};

const DROP_OFF_INDICATORS = [
  "gotta go",
  "never mind",
  "too hard",
  "give up",
  "bye",
  "leaving",
  "forget it",
];

export const CONTINUITY_PROTOCOL = {
  check: (msg: string) =>
    DROP_OFF_INDICATORS.some((p) => msg.toLowerCase().includes(p)),
  response:
    "I hear you, and it's completely okay to step away. Before you go, remember: you don't have to figure it all out today. Just focus on the next 5 minutes — one small, clear step is enough. This space will always be right here, anonymous and ready, whenever you want to pick this back up. Be gentle with yourself. 💙",
};

/**
 * Signals of genuine hardship or need for professional/human support.
 * Deliberately scoped to clear-need phrases (not topic mentions like "money"
 * or "legal") so a benign question never triggers an automatic redirect.
 */
const RESOURCE_SIGNALS = [
  "can't afford",
  "cannot afford",
  "can't pay",
  "no money",
  "out of money",
  "broke",
  "overdue",
  "behind on",
  "eviction",
  "evicted",
  "shut off",
  "cut off",
  "debt collector",
  "debt collection",
  "lawsuit",
  "sued",
  "suing",
  "lawyer",
  "attorney",
  "legal aid",
  "therapist",
  "counselor",
  "professional help",
  "hotline",
  "financial aid",
  "help with bills",
];

export function detectResourceNeed(message: string): boolean {
  const lower = message.toLowerCase();
  return RESOURCE_SIGNALS.some((s) => lower.includes(s));
}

// ─────────────────────────── 2. Knowledge types ─────────────────────────────

export interface ExpertFramework {
  /** Stable identifier for the framework (e.g. "50-30-20"). */
  id: string;
  /** Keywords that should trigger this framework. */
  triggers: string[];
  /** Human-readable framework name. */
  name: string;
  /** Deterministic, evidence-based steps. */
  steps: string[];
  /** Boundary/limitation note, shown verbatim when this framework matches. */
  caution?: string;
}

export interface ExpertTopic {
  /** URL/route key, e.g. "finance". */
  id: string;
  /** Blocks-network agent name. */
  agentName: string;
  /** Registered tool name. */
  toolName: string;
  description: string;
  port: number;
  /** The strict, platform-aligned expert system prompt. */
  systemPrompt: string;
  /** Short, honest limitation note appended to every response. */
  disclaimer: string;
  /** Curated knowledge base of industry-standard frameworks. */
  frameworks: ExpertFramework[];
}

export interface ConsultInput {
  message: string;
}

// ─────────────────────── 3. Deterministic framework logic ───────────────────

/** Normalize a phrase into a token set for fuzzy top-call matching. */
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s']/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

/**
 * Top-call boost — if the user's message closely matches one of the curated
 * "50 most common questions" for this expert, the mapped framework receives a
 * strong deterministic boost (up to +20, dominating weak trigger matches).
 * Coverage = fraction of the top call's words present in the message, so users
 * who send a suggested question verbatim (or lightly edited) always land on
 * the right framework — even when the LLM is unavailable.
 */
export function topCallBoost(
  topicId: string,
  message: string
): { frameworkId: string; boost: number } | null {
  const calls = TOP_CALLS_BY_EXPERT[topicId];
  if (!calls) return null;
  const msgTokens = tokenize(message);
  let best: { frameworkId: string; boost: number } | null = null;

  for (const call of calls) {
    if (!call.frameworkId) continue;
    const qTokens = tokenize(call.question);
    if (!qTokens.size) continue;
    let hit = 0;
    for (const t of qTokens) {
      if (msgTokens.has(t)) hit += 1;
    }
    const coverage = hit / qTokens.size;
    if (coverage >= 0.6) {
      const boost = Math.round(coverage * 20);
      if (!best || boost > best.boost) {
        best = { frameworkId: call.frameworkId, boost };
      }
    }
  }

  return best;
}

export function matchFramework(
  topic: ExpertTopic,
  message: string
): ExpertFramework | null {
  const lower = message.toLowerCase();
  const callBoost = topCallBoost(topic.id, message);
  let best: ExpertFramework | null = null;
  let bestScore = 0;

  for (const fw of topic.frameworks) {
    let score = 0;
    for (const trigger of fw.triggers) {
      if (lower.includes(trigger)) score += 1;
    }
    // A strongly-matched top call pins the framework deterministically.
    if (callBoost && callBoost.frameworkId === fw.id) score += callBoost.boost;
    if (score > bestScore) {
      bestScore = score;
      best = fw;
    }
  }

  return bestScore >= 1 ? best : null;
}

/** Fully deterministic answer built from a matched framework (no LLM needed). */
export function formatFrameworkAnswer(fw: ExpertFramework): string {
  const lines = fw.steps.map((step, i) => `${i + 1}. ${step}`).join("\n");
  const caution = fw.caution ? `\n\n⚠️ ${fw.caution}` : "";
  return (
    `Here's a clear, grounded way to approach this — the **${fw.name}** method:\n\n${lines}` +
    caution +
    "\n\nYou can take step one today; it only takes a few minutes. If this involves money, legal documents, or urgent support, ask me to connect you with resources."
  );
}

// ─────────────────────── 4. LLM enrichment layer ────────────────────────────

interface LLMResult {
  response: string;
  framework_used: string;
}

function safeParseJson(text: string): Record<string, unknown> | null {
  try {
    const value = JSON.parse(text);
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function buildScaffold(topic: ExpertTopic, fw: ExpertFramework | null): string {
  if (!fw) {
    return "No specific framework matched — respond with your best plain-language guidance for the user's situation, staying within your expertise and disclaiming anything outside it.";
  }
  const steps = fw.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  const caution = fw.caution ? `\nCaution/limits: ${fw.caution}` : "";
  return `A relevant, evidence-based framework was identified: **${fw.name}**.\nIts steps:\n${steps}${caution}\n\nGround your guidance in this framework. Do not contradict it. If the user's situation goes beyond it, say so plainly and suggest connecting with a qualified human.`;
}

export async function enrichWithLLM(
  topic: ExpertTopic,
  message: string,
  fw: ExpertFramework | null
): Promise<LLMResult | null> {
  try {
    const scaffold = buildScaffold(topic, fw);
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: topic.systemPrompt },
        {
          role: "user",
          content: `USER MESSAGE:\n${message}\n\n${scaffold}\n\nReturn ONLY valid JSON with exactly these keys: "response" (your full guidance, 1-3 short paragraphs, ending with one gentle next step), "framework_used" (the framework name or "General").`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const parsed = safeParseJson(response.choices[0].message.content || "");
    if (!parsed || typeof parsed.response !== "string" || !parsed.response.trim()) {
      return null;
    }
    return {
      response: parsed.response.trim(),
      framework_used:
        typeof parsed.framework_used === "string"
          ? parsed.framework_used
          : fw?.name || "General",
    };
  } catch {
    return null;
  }
}

// ─────────────────────── 5. Pipeline orchestration ──────────────────────────

export async function runExpertConsult(
  topic: ExpertTopic,
  input: ConsultInput
): Promise<Record<string, unknown>> {
  const message = (input?.message || "").trim();

  if (!message) {
    return {
      status: "error",
      message: "Please share a little more about what you'd like to think through.",
      billed_amount: 0,
    };
  }

  // 1. Urgent safety screening — always first, always free.
  if (CRISIS_KEYWORDS.test(message)) {
    return { ...CRISIS_RESPONSE, expert: topic.id, disclaimer: topic.disclaimer };
  }

  // 2. Continuity protocol.
  if (CONTINUITY_PROTOCOL.check(message)) {
    return {
      status: "success",
      expert: topic.id,
      response: CONTINUITY_PROTOCOL.response,
      route_to_resources: false,
      billed_amount: 0,
    };
  }

  // 3. Deterministic framework match.
  const fw = matchFramework(topic, message);

  // 4. LLM enrichment.
  const llm = await enrichWithLLM(topic, message, fw);

  // 5. Guaranteed fallback — the knowledge base answers even if the LLM is down.
  let response =
    llm?.response || (fw ? formatFrameworkAnswer(fw) : fallbackAnswer(topic));
  const frameworkUsed = llm?.framework_used || fw?.name || "General";

  // Routing is marker-driven (like the Navigator): the app redirects only when
  // the final response actually contains [ROUTE_TO_RESOURCES]. If the user's
  // message signals a genuine resource need, append the marker to the answer.
  if (!response.includes("[ROUTE_TO_RESOURCES]") && detectResourceNeed(message)) {
    response += "\n\n[ROUTE_TO_RESOURCES]";
  }
  const routeToResources = response.includes("[ROUTE_TO_RESOURCES]");

  return {
    status: "success",
    expert: topic.id,
    response,
    framework_used: frameworkUsed,
    route_to_resources: routeToResources,
    disclaimer: topic.disclaimer,
    billed_amount: 0,
  };
}

function fallbackAnswer(topic: ExpertTopic): string {
  return (
    `Here's a calm, practical way to look at this.\n\n` +
    `Start by writing down the specific situation in one or two sentences — the clearer the problem, the clearer the path. Then sort what's fully within your control (your next action) from what isn't (outcomes, other people, rules outside your influence). Take one small step on the first item you control, and let that momentum decide the next move.\n\n` +
    `If this touches money, legal rights, or anything urgent, I can point you to resources — just say the word.`
  );
}
