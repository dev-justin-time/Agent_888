# LumaNation Unification & Improvement Plan (ADD)

> **Goal:** organize the total project, centralize/reuse common code, keep concerns separate, and integrate the HTML pages into a single production-grade Next.js TSX platform with unified navigation. No features are deleted; everything is moved or upgraded.

## 1. Current State Audit

| Area | Files | Issues |
|------|-------|--------|
| Frontend | `app/page.tsx`, `layout.tsx`, `globals.css`, many `*.html` pages | SPA mock data, duplicated Tailwind config in HTML, no shared layout, no real routing |
| Design | `DESIGN.md` | Tokens exist but are not centralized in Tailwind config |
| Backend agents | `luma-navigator.ts`, `luma-resources.ts`, `luma-community.ts`, `luma-escrow-manager.ts`, `luma-partner-outreach.ts` | Standalone services with hard-coded mock data and no frontend wiring |
| Assets | PNG/Marketing images | Loose in app root; need organized `public/` or `assets/` structure |

## 2. Target Project Structure

```text
luma-platform/                 <- repo root
├── app/                       <- Next.js 14 App Router
│   ├── (main)/                <- persistent top bar + bottom nav
│   │   ├── navigate/page.tsx
│   │   ├── resources/page.tsx
│   │   ├── community/page.tsx
│   │   ├── stewardship/page.tsx
│   │   └── layout.tsx
│   ├── api/                   <- route handlers that call agents/services
│   │   ├── chat/route.ts
│   │   ├── providers/route.ts
│   │   ├── resources/route.ts
│   │   ├── generate-escrow/route.ts
│   │   └── partner-outreach/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/                <- shared UI pieces
│   ├── ui/                    <- GlassCard, Button, Input, Chip, Badge
│   └── layout/                <- TopAppBar, BottomNav
├── lib/                       <- pure helpers, types, validation schemas
│   ├── constants.ts
│   ├── types.ts
│   ├── validators.ts
│   └── utils.ts
├── agents/                    <- moved from sibling `agents` directory
│   ├── luma-navigator.ts
│   ├── luma-resources.ts
│   ├── luma-community.ts
│   ├── luma-escrow-manager.ts
│   └── luma-partner-outreach.ts
├── data/                      <- structured real-world data with clear replaceable source
│   ├── hotlines.json
│   ├── grants.json
│   └── providers.json
├── public/                    <- images, icons, marketing assets
├── tests/
├── tailwind.config.ts
├── tsconfig.json
└── ADD.md                     <- this file
```

## 3. Centralization & Concern Separation

1. **Design tokens** → `tailwind.config.ts` (colors, fonts, spacing) sourced from `DESIGN.md`. No more inline Tailwind scripts in HTML.
2. **Shared styles** → `app/globals.css` for `.glass-card`, `.inner-glow`, `.luma-gradient-bg`, keyframes, etc.
3. **Shared components** → `components/layout/` and `components/ui/` (TopAppBar, BottomNav, GlassCard, ChatBubble, ProviderCard, GrantCard, HotlineCard).
4. **Routing** → Next.js file-based routes under `app/(main)/`. The current `page.tsx` SPA tabs become separate pages; `/` can redirect or render a landing hero.
5. **Backend logic** → `agents/` contain service logic. `app/api/` contains thin route handlers that import and call agent functions.
6. **Data** → `data/*.json` holds provider, hotline, and grant data with typed schemas. Real backend can replace JSON without touching UI.
7. **Types/validation** → `lib/types.ts` and `lib/validators.ts` shared across frontend and agents.

## 4. HTML → TSX Route Mapping

| HTML Page | New Route | Key Content |
|-----------|-----------|-------------|
| `navigate_luma_chat.html` | `/navigate` | Chat interface with Luma guide |
| `navigate_empathetic_guidance.html` | `/navigate/guidance` | Empathetic guidance modes |
| `navigate_immersive_guidance.html` | `/navigate/immersive` | Immersive/grounding exercises |
| `resources_sanctuary_support.html` | `/resources` | Hotlines & immediate support |
| `resources_support_grants_1.html` `/resources/grants` | Grants directory |
| `resources_support_grants_2.html` | `/resources/grants/[id]` | Grant detail |
| `community_providers.html` | `/community` | Provider directory |
| `community_verified_providers.html` | `/community/verified` | Verified-only filter |
| `community_shared_resonance.html` | `/community/resonance` | Community stories/resonance |
| `community_deep_earth_variant.html` | `/community` variant theme | Theme variant preserved |
| `stewardship_partner_tools.html` `/stewardship_partner_tools_2.html` | `/stewardship` | Partner outreach & escrow tools |
| `stewardship_ethical_growth.html` | `/stewardship/ethical-growth` | Ethical growth framework |

> All original HTML files will be preserved in `archive/html-source/` as a reference, not deleted.

## 5. Production-Grade Wiring (No Mocks)

### 5.1 Chat (`/navigate`)
- Use Vercel AI SDK `useChat()` on the client.
- `app/api/chat/route.ts` calls `luma-navigator.ts` logic.
- OpenAI key from `process.env.OPENAI_API_KEY`.
- Continuity protocol and `[ROUTE_TO_RESOURCES]` detection preserved.
- Optional: function-call trigger for "Sensory Grounding" mini-modal.

### 5.2 Providers (`/community`)
- `app/api/providers/route.ts` fetches from `data/providers.json` (replaceable with DB later).
- `luma-community.ts` upgraded to validate provider type/locale and generate secure handoff links with signed tokens.
- Client supports filtering by type, locale, and cost.

### 5.3 Resources (`/resources`)
- `app/api/resources/route.ts` returns hotlines by locale from `data/hotlines.json` and sponsors from `data/grants.json`.
- `luma-resources.ts` upgraded to handle locale fallbacks.

### 5.4 Stewardship (`/stewardship`)
- `app/api/generate-escrow/route.ts` uses `luma-escrow-manager.ts` with OpenAI structured outputs + Zod validation.
- `app/api/partner-outreach/route.ts` uses `luma-partner-outreach.ts`.
- Both endpoints return typed JSON; UI supports copy, mailto, and PDF export.

## 6. Meaningful Functions to Add per Use Case

### Navigate
1. `sendMessage(message, sessionId)` – streaming chat with continuity protocol.
2. `triggerGroundingExercise(type)` – open a guided breathing/grounding modal.
3. `routeToResources(signal)` – auto-switch to resources when LLM signals need.
4. `getSuggestedPrompts()` – context-aware prompt chips.
5. `endSessionGracefully()` – clear local state and show a closing affirmation.

### Resources
1. `getLocalHotlines(locale)` – locale-based hotline lookup with fallback.
2. `getGrants(eligibility)` – filter grants by eligibility criteria.
3. `detectLocale()` – browser geolocation or timezone-based locale guess.
4. `bookmarkResource(id)` – client-side bookmarks in `localStorage`.
5. `applyForGrant(grantId, application)` – form submission to API.

### Community
1. `listProviders(filters)` – filter by type, locale, cost, verified status.
2. `connectToProvider(providerId)` – generate secure off-platform handoff link.
3. `verifyProviderBadge(providerId)` – fetch verification status and badges.
4. `submitProviderApplication(form)` – allow new providers to apply.
5. `toggleViewMode()` – list/grid/map view for providers.

### Stewardship
1. `generatePartnerOutreach(org)` – AI-generated, structured outreach email.
2. `generateEscrowDocument(input)` – AI-generated escrow instruction document.
3. `copyToClipboard(text)` – utility with success feedback.
4. `downloadEscrowPdf(document)` – generate PDF from escrow doc.
5. `sendPartnerEmail(mailtoUrl)` – open native mail client with composed email.

## 7. Non-Functional Requirements

- **TypeScript:** strict mode; all data shapes typed.
- **Accessibility:** semantic HTML, focus states, keyboard nav, ARIA labels.
- **Tests:** unit tests for utilities/agents, integration tests for API routes, and component tests for shared UI.
- **Linting:** Next.js + Tailwind plugin + TypeScript ESLint.
- **Environment:** `.env.example` documenting all required keys.
- **Privacy:** no persistent user identity; ephemeral sessions; no analytics without consent.

## 8. Decisions Made

1. ✅ **Repo root:** `luma-platform` is the project root, with `app/` and `agents/` as sibling directories.
2. ✅ **Agent deployment:** Keep the five TS agents as standalone services and have the Next.js app call them via HTTP through API route proxies.
3. ✅ **Data source:** Use typed JSON files (`data/providers.json`, `data/hotlines.json`, `data/grants.json`) as the source of truth, with a clear migration path to a real database later. Agents read from these files instead of hard-coded arrays.
4. ✅ **Privacy vs. AI:** Continue using OpenAI API with clear disclosure; agents already route through OpenAI.

## 9. Implementation Phases

1. **Foundation:** centralize Tailwind tokens, shared components, and layout.
2. **Data & Agents:** move mock data into JSON files and update agents to read them.
3. **API Routes:** create Next.js route handlers that proxy to each standalone agent.
4. **Routes:** convert the four main HTML categories into Next.js pages under `app/(main)/`.
5. **Archive:** preserve all original HTML files in `archive/html-source/`.
6. **Validate:** typecheck, lint, and run the app.
