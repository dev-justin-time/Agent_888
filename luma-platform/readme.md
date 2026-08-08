# 🌿 Luma Platform
**Private, anonymous, zero-label life navigation.**

Luma is designed to provide maximum human value without extracting profit or compromising privacy. It uses story-based, third-person guidance to help users navigate heavy days, connects them to verified off-platform professionals, and manages mission-aligned funding with absolute transparency.

## 🚀 Quick Start (Local, fully offline)

Everything runs on your machine — no Postgres server, no OpenAI key, no cloud accounts.

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Install & start Ollama** (the local LLM)
   ```bash
   ollama serve          # keep running in a terminal
   ollama pull llama3.2  # one time (~2 GB)
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Generate NEXTAUTH_SECRET and pick an ADMIN_EMAIL / ADMIN_PASSWORD
   ```

4. **Create the local SQLite database and seed it**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed       # hotlines, grants, providers + the admin user
   ```
   `db:seed` reads `ADMIN_EMAIL`/`ADMIN_PASSWORD` from the environment. If you
   set them only in `.env.local`, run it as:
   ```bash
   set -a && source .env.local && set +a && npm run db:seed
   ```

5. **Start the Next.js app**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000). Sign in at `/sign-in` with
`ADMIN_EMAIL`/`ADMIN_PASSWORD` to reach `/admin`.

### Optional: Blocks Network deployment (paid)

The app itself is fully local, but the same agent definitions under `blocks/`
can still be published to [Blocks Network](https://blocks.ai). See
`blocks/README.md` for the full runbook (deployed agents need an OpenAI key,
and the resources/community agents read the app's local SQLite DB).

## 🏗 Architecture

- **Framework:** Next.js 14 App Router + React + TypeScript
- **Styling:** Tailwind CSS with a custom sanctuary-themed design system
- **Database:** SQLite file (`prisma/dev.db`) via Prisma ORM — zero external services
- **Auth:** Next-Auth v5 (beta) with credentials provider and bcrypt
- **AI:** local Ollama model via its OpenAI-compatible endpoint (`lib/ollama.ts`), using the curated expert knowledge base in `agents/lib/` for deterministic, evidence-based frameworks with an LLM enrichment layer and guaranteed non-LLM fallbacks
- **Safety rails:** crisis keyword screening, continuity protocol, and marker-driven resource routing on both `/navigate` and `/experts`
- **Agents:** the same handlers under `blocks/` can be deployed to [Blocks Network](https://blocks.ai) (`lib/blocks-agents.ts` is the app-side consumer for that optional setup)

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
