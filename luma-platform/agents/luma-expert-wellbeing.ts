import { createExpertAgent, ExpertTopic } from "./lib/expert-core";

const WELLBEING_TOPIC: ExpertTopic = {
  id: "wellbeing",
  agentName: "luma_wellbeing_expert",
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

createExpertAgent(WELLBEING_TOPIC);
