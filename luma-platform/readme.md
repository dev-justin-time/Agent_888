# 🌿 Luma Platform
**Private, anonymous, zero-label life navigation.**

Luma is designed to provide maximum human value without extracting profit or compromising privacy. It uses story-based, third-person guidance to help users navigate heavy days, connects them to verified off-platform professionals, and manages mission-aligned funding with absolute transparency.

## 🚀 Quick Start (Local)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Postgres URL, NextAuth secret, and OpenAI key.
   ```

3. **Generate Prisma client and run migrations**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Seed the database**
   ```bash
   npm run db:seed
   ```

5. **Start the Next.js app**
   ```bash
   npm run dev
   ```

6. **Deploy the agents to Blocks Network (paid)** — see `blocks/README.md` for the full runbook
   ```bash
   npm install -g @blocks-network/cli   # Blocks CLI (one time)
   npm run blocks:login                 # browser OAuth → writes BLOCKS_API_KEY to .env
   npm run blocks:register-all          # all 12 agents private + free
   npm run blocks:publish-free          # resources & community (private, free)
   npm run blocks:publish-paid          # navigator, experts ($0.05) + escrow, outreach ($0.25)
   npm run blocks:run:navigator         # one terminal per agent to keep it live
   ```

Visit [http://localhost:3000](http://localhost:3000).

## 🏗 Architecture

- **Framework:** Next.js 14 App Router + React + TypeScript
- **Styling:** Tailwind CSS with a custom sanctuary-themed design system
- **Database:** Postgres (Neon/Supabase/local) via Prisma ORM
- **Auth:** Next-Auth v5 (beta) with credentials provider and bcrypt
- **AI:** OpenAI (used by the LLM-powered Blocks agents)
- **Agents:** 12 agents deployed to [Blocks Network](https://blocks.ai) as real `handler.ts` + `agent-card.json` projects under `blocks/`. The Next.js app calls them server-side via the Blocks SDK `TaskClient` (`lib/blocks-agents.ts`) — no localhost HTTP proxies, no fake SDK stubs.

## 📂 Notable Routes

- `/` — Landing page
- `/navigate` — Anonymous chat with Luma
- `/resources` — Hotlines & grants
- `/community` — Verified providers
- `/experts` — Expert guidance (money, legal, career, learning, home, digital, wellbeing)
- `/stewardship` — Partner outreach & escrow instructions
- `/sign-in`, `/sign-up` — Provider authentication
- `/provider/apply` — Provider onboarding application
- `/[section]/[variant]` — Legacy HTML variants (preserved from `archive/html-source/`)

## 🧪 Validation

```bash
npx tsc --noEmit   # TypeScript check
npm run build      # Production build
npm run lint       # ESLint (run locally; may timeout in some CI environments)
```

## 📄 License

Proprietary — Luma/LumaNation.
