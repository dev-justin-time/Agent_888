import { createExpertAgent, ExpertTopic } from "./lib/expert-core";

const LEARNING_TOPIC: ExpertTopic = {
  id: "learning",
  agentName: "luma_learning_expert",
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

createExpertAgent(LEARNING_TOPIC);
