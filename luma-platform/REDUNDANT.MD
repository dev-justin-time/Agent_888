# LumaNation Redundant Logic Report

> **Status:** updated 2026-11-04, after the first cleanup pass.
> Everything below was re-checked against the current tree. Findings that no longer
> apply are recorded in §5 instead of being deleted, so the history stays auditable.
> Verified state: `npx tsc --noEmit` exits 0, `npm run build` succeeds, and `npm run lint`
> reports no warnings or errors.

## Summary

| Area | v1 priority | Status |
|---|---|---|
| API route boilerplate (auth, validation, error envelopes) | High | **Resolved** |
| Client page CRUD / fetch / form boilerplate | High | **Resolved** |
| Duplicated Tailwind field class string | Medium | **Resolved** (0 occurrences left) |
| Domain types redeclared in pages | Medium | **Resolved** |
| Duplicated admin role guard / loading / error blocks | Low | **Resolved** |
| Agent startup + trigger boilerplate | Medium | **Resolved** |
| Navigator prompt + safety pipeline | Medium-High | **Resolved** |
| `glass-card` class string bypassing `GlassCard` | Medium | **Resolved** (11 sites) |
| Per-block npm scripts (13 → 2) | Low | **Resolved** |
| `billed_amount: 0` in every block payload | Low | **Resolved** |
| Pill search-input class string | Low | **Resolved** (4 sites) |

---

## 1. Resolved in the first pass

| What was duplicated | Where it lives now | Consumers |
|---|---|---|
| `{ status: "success" \| "error" }` envelopes, 400 validation bodies, 503 fallbacks | `lib/api.ts` — `success`, `ok`, `fail`, `invalid`, `rateLimited`, `parseBody`, `runRoute` | all 12 route files |
| `P2025`/`P2002` inline checks | `lib/api.ts` — `prismaError` | admin routes |
| `requireAdmin()` → `forbidden()` → write limit → try/catch | `lib/admin.ts` — `adminRoute(options, handler)` | 4 admin route files |
| 12 identical block trigger scripts (35 lines, 3 config values) | `blocks/shared/run-trigger.ts` — `runTrigger`, `main` | 12 `trigger.ts` files, 11 lines each |
| 7 identical expert block handlers | `blocks/shared/expert-handler.ts` — `createExpertHandler` | 7 `luma-expert-*/handler.ts`, 4 lines each |
| Provider locale matcher, handoff URL, `privacy_notice`, directory listing | `lib/providers.ts` — `matchProvider`, `buildHandoffLink`, `buildConnection`, `getVerifiedProviders`, `findProviderConnection` | `app/api/providers` (GET+POST), `blocks/luma-community` (list+connect) |
| Hotline `US` fallback + grants query (and the drifted tag parsing) | `lib/resources.ts` — `getHotline`, `getGrants` | `app/api/resources`, `blocks/luma-resources` |
| Message bubble, typing dots, prompt chips, composer, scroll-to-end ref | `components/chat/ChatUI.tsx` — `MessageBubble`, `TypingBubble`, `PromptChips`, `ChatComposer`, `useAutoScroll` | `app/(main)/navigate`, `app/(main)/experts/[topic]` |
| `NAVIGATOR_PROMPT` + crisis → continuity → LLM order (and the drifted marker handling) | `agents/lib/navigator.ts` — `navigateReply`, `NAVIGATOR_PROMPT`, `RESOURCE_MARKER` | `app/api/chat`, `blocks/luma-navigator` |
| Hand-written `glass-card inner-glow` panels (11 sites) | `components/ui/GlassCard.tsx` — `<GlassCard>` with `shape` (`rounded`/`square`/`pill`/`bubble`) and `as` | `community`, `resources`, `questions`, `experts`, `experts/[topic]`, `navigate`, `app/page`, `TopQuestions`, `ChatUI` |
| Pill search field (relative wrapper + leading icon + `rounded-full` classes) | `components/ui/Field.tsx` — `SearchInput` | `community`, `experts`, `questions`, `TopQuestions` |
| 12 `blocks:run:*` scripts + 2 hand-chained publish commands | `scripts/blocks.mjs` — one manifest of billing mode, listing, and price | `npm run blocks:run -- <block>`, `npm run blocks:publish [-- free\|paid]` |
| `billed_amount: 0` in every block success payload | `blocks/shared/handler-utils.ts` — `jsonSuccess` | 6 block handlers |
| Admin PATCH body shape (id + fields) | `lib/validation.ts` — `HotlineUpdateSchema`, `GrantUpdateSchema` | admin hotlines, grants |
| Fetch / loading / error / refetch lifecycle in admin pages | `lib/admin-client.ts` — `useAdminCollection<T>` | hotlines, grants, applications |
| Admin role guard + page header + nav + loading skeleton | `components/admin/AdminPage.tsx` | 4 admin pages |
| Input / textarea / select class strings (was 26+ copies) | `components/ui/Field.tsx` — `Input`, `Textarea`, `Select` | every form |
| `AlertCircle` + error paragraph, "loading…" text | `components/ui/Feedback.tsx` — `ErrorAlert`, `LoadingState`, `AccessDenied` | admin pages, forms |
| `Hotline`, `Grant`, `ProviderApplication`, `AdminStats`, `EscrowResult`, `OutreachEmail` redeclared per page | `lib/types.ts` | 5 pages |
| Unused `copyToClipboard` import; redundant `response.includes("[ROUTE_TO_RESOURCES]")` client check | removed (`app/(main)/navigate/page.tsx`) | — |

---

## 2. Still worth doing

Nothing outstanding: every item cataloged in this report has been merged into a shared
module. Append new findings here as they are confirmed.

---

## 3. Intentional, leave alone

- **`lib/validation.ts` enums** (`ProviderTypeEnum`, `ApplicationStatusEnum`,
  `ExpertTopicEnum`): `prisma/schema.prisma` declares **no** enums — SQLite stores plain
  strings — so validation is the single source of truth. v1's "derive from the Prisma
  client" advice does not apply.
- **`handleCopy` + timeout** (`stewardship/page.tsx`): one caller; a hook would be
  indirection without payoff.
- **Role check in `TopAppBar` / `BottomNav`**: two call sites, different rendering
  contexts (server component vs client session hook). Not worth a shared hook yet.
- **Per-page renderers in admin pages**: `useAdminCollection` + `AdminPage` own the
  mechanics; a fully generic `AdminCrudPage<T>` would hide each resource's distinct form
  behind configuration, which is a net readability loss.

---

## 4. Legacy surface (decision, not a refactor)

`app/**/*.html` (15 files), `lib/legacy.ts`, and `app/(main)/[section]/[variant]/page.tsx`
serve archived HTML mockups (`support-grants-1/2`, `partner-tools-2`,
`deep-earth-variant`, …) whose content duplicates the live React pages. This is content
duplication rather than code duplication: decide whether the archive is still a product
requirement, and if not, delete the HTML, `lib/legacy.ts`, and the catch-all route
together. `generateStaticParams` currently hardcodes 11 of these paths.

---

## 5. Findings from v1 that no longer apply

| v1 finding | Why it is obsolete |
|---|---|
| Agent setup boilerplate in `agents/luma-*.ts` + `lib/agent-factory.ts` | Agents are deployed on Blocks Network (`blocks/*`), which already shares `handler-utils.ts`. The factory now lives in `blocks/shared/expert-handler.ts`. |
| OpenAI JSON-object parsing in two agents | Agents use local `lib/ollama.ts` (`completeLLM`, `completeJSON`, `extractJson`); `lib/openai.ts` does not exist. |
| `withAgentProxy(schema, envKey, port, toolName)` | No agent ports or localhost HTTP anymore; app→agent calls go through `lib/blocks-agents.ts` `callBlocksAgent`. |
| `withAdminRoute(methodHandlers)` / `withValidatedBody(schema, handler)` | Implemented in the chosen form: `adminRoute(options, handler)` and inline `parseBody` (kept inline to avoid zod generic variance and to leave handler bodies readable). |
| `useAdminCrud` generic component | Delivered as `useAdminCollection` + `AdminPage` — see §3. |
| `AlertCircle` + error text, duplicated loading skeletons | `ErrorAlert` / `LoadingState` in `components/ui/Feedback.tsx`. |
| Unused `copyToClipboard` import; redundant `[ROUTE_TO_RESOURCES]` string check in the client | Removed. |

### Tooling note (fixed)

`npm run lint` runs clean again. The cause was version skew, not configuration: the
`.eslintrc.json` legacy config is correct for Next 14, but `eslint-config-next@16` ships
flat config only and aborted under `eslint@8` with *"Converting circular structure to
JSON"* before reading any source. `eslint-config-next` is now `^14.2.35`, matching
`next@14.2.35` and its peer range (`eslint ^7.23.0 || ^8.0.0`).

Upgrading Next past 14 means moving to `eslint@9` + flat config (`eslint.config.mjs`) in
the same change — the two cannot be split, or lint breaks again.

---

## 6. Suggested order for the next pass

Nothing is queued. Every duplication this report tracked has been merged into a shared
module — §1 maps each one to its new home, and §3 records the cases left alone on purpose.

The last two passes closed the shapes that used to be exceptions: `GlassCard` now takes
`shape` (`rounded`/`square`/`pill`/`bubble`) and `as`, so the square accent callouts, the
luma bubble, and the composer no longer carry hand-written classes; and the four pill
search fields share `SearchInput`.
