# 🧱 Blocks Deployment Runbook — Luma Agents

Twelve Luma agents are deployed to [Blocks Network](https://blocks.ai) as real
Blocks projects. **Blocks is a network + billing layer, not a host** — each agent
runs as a long-lived process on your machine via `blocks run`, while Blocks
handles discovery, routing, and (for paid agents) per-task payment.

| Agent | Blocks name | Billing | Price/task |
|---|---|---|---|
| Core life navigator | `lumanation_navigator` | paid | $0.05 |
| Support resources (hotlines/grants) | `lumanation_resources` | free · private | — |
| Verified provider handoff | `lumanation_community` | free · private | — |
| Escrow instructions | `lumanation_escrow_steward` | paid | $0.25 |
| Partnership outreach | `lumanation_partner_architect` | paid | $0.25 |
| 7 expert guides (finance, legal, career, learning, home, digital, wellbeing) | `lumanation_expert_*` | paid | $0.05 each |

Each folder is a standalone project: `handler.ts` (the agent logic),
`agent-card.json` (A2A metadata), `package.json`, `.env.example`, and
`trigger.ts` (a local test caller).

---

## 1. Prerequisites

- Node ≥ 22 (this machine: v24) ✅
- Install the Blocks CLI:
  ```bash
  npm install -g @blocks-network/cli
  blocks --version
  ```

## 2. Authenticate (one time, interactive)

```bash
npm run blocks:login
```

This opens a browser (Google/GitHub OAuth), mints an org-scoped `bk_` API key,
and writes `BLOCKS_API_KEY` to `.env`. **Copy that same key into every
`blocks/*/.env`** (or just the ones you run):

```
BLOCKS_API_KEY=bk_...
# Model-backed agents use the local Ollama instance on this machine.
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.2:3b
# luma-resources & luma-community read through ../../lib/prisma.ts, which now
# targets the app's LOCAL SQLite database — set DATABASE_URL="file:./dev.db"
# (relative to prisma/) and run those two agents on a machine with that file.
DATABASE_URL="file:./dev.db"
```

The model-backed agents do not require `OPENAI_API_KEY`. Ollama must be running
and reachable from the same machine as each `blocks run` process (`ollama serve`).
Use `ollama list` to confirm that `OLLAMA_MODEL` is installed.

> Agent names are claimed network-wide. If a name is already taken,
> `blocks register` will error — rename it in the folder's `agent-card.json`.

## 3. Validate & register (private + free)

```bash
npm run blocks:check          # validates every agent-card.json + handler
npm run blocks:register-all   # registers all 12 as private + free
```

## 4. Test an agent locally

With the agent running in one terminal:

```bash
npm run blocks:run:navigator
```

…and from another (in the same folder):

```bash
npx tsx trigger.ts
```

Expect `[done] Task complete` and the JSON artifact. Test each agent before
publishing it.

## 5. Publish

```bash
npm run blocks:publish-free   # resources + community (private, free)
npm run blocks:publish-paid   # 10 paid agents (public, per-task pricing)
```

`--accept-terms` attests legal compliance and accepts the Blocks paid-provider
terms. Payouts: callers pay per task, you keep 85%, Blocks takes 15% (Stripe,
no minimums).

## 6. Keep agents live

Each agent must keep running for callers to reach it — one terminal (or `tmux`
/ PM2 / a system service) per agent:

```bash
npm run blocks:run:navigator
npm run blocks:run:expert-finance
# …one per agent you want live
```

## 7. Calling the agents from the app

**The app no longer depends on Blocks by default.** As of the local-first
refactor, every route runs on your machine: `/api/chat` and `/api/expert` use
Ollama directly (`lib/ollama.ts`), and `/api/resources` + `/api/providers` read
the local SQLite database. This deployment runbook is now optional — only
needed if you want to offer the agents to external callers on Blocks Network.

`lib/blocks-agents.ts` still wraps the Blocks `TaskClient` if you want to
switch a route back to a deployed agent. It needs `BLOCKS_API_KEY` in the
app's `.env.local`, and the free agents (resources/community) additionally
need the SQLite `DATABASE_URL` above and must be running locally.

## 8. Top-50 logic libraries (`data/top-calls/`)

Every agent ships a curated library of its **50 most common logic calls /
questions / formulas** (600 total) in `data/top-calls/`:

- **Experts (7 × 50)** — each question maps to a deterministic framework
  (`frameworkId`), so `agents/lib/expert-logic.ts` boosts the best-fit
  framework when a user sends a top call verbatim or lightly edited — the
  right answer is guaranteed even with the LLM down.
- **Navigator (50)** — the most common ways people open up (`navigator.ts`).
- **Resources (50)** — hotline / grant needs with page actions (`resources.ts`).
- **Community (50)** — provider needs with search + type prefills (`community.ts`).
- **Escrow (50) + Outreach (50)** — stewardship scenarios with full form
  prefills (`escrow.ts`, `outreach.ts`).

The app surfaces them as searchable chip pickers on `/experts/[topic]`,
`/navigate`, `/resources`, `/community`, and `/stewardship`. The agent cards
carry the top-call categories as tags and example prompts in their input
description. **After editing the logic or data, re-publish the affected agents**
so callers receive the updated behavior.

---

## Maintenance

- **Rotating the key:** `blocks login --write-env` again, restart agents.
- **Changing a card:** re-run `blocks register` (private) or `blocks publish`
  with explicit flags (public/paid) so you don't accidentally flip it back.
- **Pricing changes:** `blocks publish --billing-mode paid --price <new> --accept-terms`.
- **Removing an agent:** `blocks logout` is local only — disable the key or
  delete the agent from the dashboard at app.blocks.ai.
