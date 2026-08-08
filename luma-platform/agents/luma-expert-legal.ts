import { createExpertAgent, ExpertTopic } from "./lib/expert-core";

const LEGAL_TOPIC: ExpertTopic = {
  id: "legal",
  agentName: "luma_legal_expert",
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

createExpertAgent(LEGAL_TOPIC);
