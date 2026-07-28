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

6. **Start the standalone agents (in separate terminals)**
   ```bash
   npm run agent:navigator
   npm run agent:resources
   npm run agent:community
   npm run agent:outreach
   npm run agent:escrow
   ```

Visit [http://localhost:3000](http://localhost:3000).

## 🏗 Architecture

- **Framework:** Next.js 14 App Router + React + TypeScript
- **Styling:** Tailwind CSS with a custom sanctuary-themed design system
- **Database:** Postgres (Neon/Supabase/local) via Prisma ORM
- **Auth:** Next-Auth v5 (beta) with credentials provider and bcrypt
- **AI:** OpenAI (used by standalone agents)
- **Agents:** Standalone services in `agents/` called via HTTP from Next.js API routes

## 📂 Notable Routes

- `/` — Landing page
- `/navigate` — Anonymous chat with Luma
- `/resources` — Hotlines & grants
- `/community` — Verified providers
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
