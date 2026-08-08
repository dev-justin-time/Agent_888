import { createExpertAgent, ExpertTopic } from "./lib/expert-core";

const DIGITAL_TOPIC: ExpertTopic = {
  id: "digital",
  agentName: "luma_digital_expert",
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

createExpertAgent(DIGITAL_TOPIC);
