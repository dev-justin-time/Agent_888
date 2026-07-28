# Luma Platform — Implementation Plan & Status

## 1. Project Structure

```
luma-platform/
├── app/                    # Next.js 14 App Router
│   ├── (main)/             # Shared layout with top bar + bottom nav
│   │   ├── page.tsx         # Landing page
│   │   ├── navigate/page.tsx
│   │   ├── resources/page.tsx
│   │   ├── community/page.tsx
│   │   ├── stewardship/page.tsx
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── provider/apply/page.tsx
│   │   └── [section]/[variant]/page.tsx   # Legacy HTML variants
│   ├── api/
│   │   ├── chat/route.ts
│   │   ├── resources/route.ts
│   │   ├── providers/route.ts
│   │   ├── provider/apply/route.ts
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── auth/register/route.ts
│   │   ├── generate-escrow/route.ts
│   │   └── partner-outreach/route.ts
│   ├── layout.tsx
│   └── globals.css
├── agents/                  # Standalone agent services
│   ├── luma-navigator.ts
│   ├── luma-resources.ts
│   ├── luma-community.ts
│   ├── luma-partner-outreach.ts
│   └── luma-escrow-manager.ts
├── components/              # Shared UI & layout
│   ├── ui/
│   ├── layout/
│   └── providers/
├── lib/                     # Utils, Prisma client, agent HTTP client
├── prisma/                  # Prisma schema + seed script
├── data/                    # JSON fallback / seed data
├── archive/html-source/     # Original HTML files preserved
├── types/                   # TypeScript declarations
└── .env.example
```

## 2. Design System

All shared visual concerns live in:

- `tailwind.config.ts` — color tokens, typography, radii, keyframes.
- `app/globals.css` — dark theme base, glass-card utilities, gradients.
- `components/ui/*` — `GlassCard`, `Button`, `Chip`.
- `components/layout/*` — `TopAppBar`, `BottomNav`, `MainLayout`.

## 3. Route Map (HTML → Next.js)

| Original HTML Page(s)                         | New Route                              |
|------------------------------------------------|----------------------------------------|
| `navigate_luma_chat.html`                      | `/navigate`                            |
| `navigate_empathetic_guidance.html`            | `/navigate/empathetic-guidance`        |
| `navigate_immersive_guidance.html`             | `/navigate/immersive-guidance`         |
| `resources_support_grants_*.html`              | `/resources/support-grants-1`, `...-2` |
| `resources_sanctuary_support.html`             | `/resources`                           |
| `community_providers.html`, `community_verified_providers.html` | `/community` |
| `community_shared_resonance.html`, `community_deep_earth_variant.html` | `/community/shared-resonance`, `/community/deep-earth-variant` |
| `stewardship_partner_tools.html`, `..._2.html` | `/stewardship/partner-tools`, `...-2`  |
| `stewardship_ethical_growth.html`              | `/stewardship/ethical-growth`          |

## 4. Backend & Data

- **Database:** Postgres via Prisma ORM (schema in `prisma/schema.prisma`).
- **Models:** `User`, `Provider`, `Grant`, `Hotline`, `ProviderApplication`.
- **Auth:** Next-Auth v5 (beta) with email/password credentials, bcrypt, JWT.
- **Agent wiring:** API routes proxy to standalone agents via `AGENT_*_URL` env vars.
- **Fallback:** API routes fall back to local JSON files if the database is unreachable.

## 5. Provider Onboarding Flow

1. User creates account at `/sign-up` (role: `PROVIDER`).
2. User signs in at `/sign-in`.
3. User submits provider application at `/provider/apply`.
4. Application is stored with `PENDING` status; admin can later approve.

## 6. Environment Variables

See `.env.example` for:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `OPENAI_API_KEY`
- `AGENT_*_URL`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`

## 7. Scripts

```bash
npm install
npx prisma generate        # generate Prisma client
npx prisma migrate dev     # create database tables
npm run db:seed            # seed hotlines, grants, providers, admin
npm run dev                # Next.js dev server
npm run build              # production build
npm run agent:navigator    # start individual agent
npm run agent:resources
npm run agent:community
npm run agent:outreach
npm run agent:escrow
```

## 8. Implementation Status

- ✅ Project root set to `luma-platform` with `app/` and `agents/` siblings.
- ✅ Shared Tailwind tokens, globals, and reusable UI components created.
- ✅ Four primary routes implemented: `/navigate`, `/resources`, `/community`, `/stewardship`.
- ✅ API routes proxy to standalone agents via env-configurable URLs.
- ✅ Agents upgraded to query a real Postgres database via Prisma.
- ✅ Provider onboarding with NextAuth credentials flow.
- ✅ Archived HTML files converted into `/[section]/[variant]` sub-routes.
- ✅ Original HTML files preserved in `archive/html-source/`.
- ✅ TypeScript (`npx tsc --noEmit`) passes.
- ✅ Next.js production build (`npm run build`) succeeds.
- ⚠️ `npm run lint` timed out in this environment; run locally after install.

## 9. Next Steps / Follow-Ups

- Wire an admin dashboard to approve/reject provider applications.
- Add email verification or magic-link sign-up (currently only credentials).
- Write unit/integration tests for API routes and auth flows.
- Replace the mocked `luma.link/bridge/:id` URL with real off-platform handoff.
