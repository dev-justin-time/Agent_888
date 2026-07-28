# LumaNation Redundant Logic Report

This report catalogs duplicated, near-identical, or overly-repetitive code in the LumaNation project. No files were modified; this is a read-only analysis to guide future refactoring.

## Summary of Findings

| Category | Count | Priority |
|---|---|---|
| API route boilerplate (auth, validation, errors) | High | High |
| Client page CRUD / fetch / form boilerplate | High | High |
| Duplicated Tailwind utility class strings | High | Medium |
| Duplicated interfaces/types in client pages | Medium | Medium |
| Agent startup/tool boilerplate | Medium | Medium |
| Duplicated business logic between agents and API routes | Medium | High |
| Repeated UI / loading / error patterns | Medium | Low |

---

## 1. API Route Handler Redundancy

### 1.1 Admin auth + rate-limit + error guard

Every admin route repeats the same procedural guard:

```typescript
const session = await requireAdmin();
if (!session) return forbidden();

const limit = adminWriteLimit(req, RATE_LIMIT_PREFIX);
if (limit) return limit;
```

**Files affected:**
- `app/api/admin/hotlines/route.ts` (lines ~9, ~22, ~48, ~86)
- `app/api/admin/grants/route.ts` (lines ~9, ~22, ~45, ~80)
- `app/api/admin/applications/route.ts` (lines ~9, ~31)
- `app/api/admin/stats/route.ts` (line ~6)

**Recommendation:** Create a higher-order route wrapper, e.g. `withAdminRoute(methodHandlers)` or `withAdminMutation(req, fn)` that composes `requireAdmin`, rate limiting, and centralized error mapping. This would collapse each admin method handler by ~4 lines and remove repetitive imports.

---

### 1.2 Generic validation + 503 error pattern in public API routes

The following routes share an almost identical shape:

```typescript
try {
  const body = await req.json();
  const parsed = SomeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ status: "error", ...formatValidationError(parsed) }, { status: 400 });
  }
  // call agent / prisma
} catch {
  return NextResponse.json({ status: "error", message: "... is temporarily unavailable." }, { status: 503 });
}
```

**Files affected:**
- `app/api/chat/route.ts`
- `app/api/generate-escrow/route.ts`
- `app/api/partner-outreach/route.ts`
- `app/api/provider/apply/route.ts`
- `app/api/resources/route.ts`
- `app/api/providers/route.ts`
- `app/api/auth/register/route.ts`

**Recommendation:** Introduce a `withValidatedBody(schema, handler)` or `withAgentProxy(schema, envKey, port, toolName)` helper in `lib/api.ts`. Public agent routes (`chat`, `generate-escrow`, `partner-outreach`) could become single-line declarations.

---

### 1.3 Response-shape helpers not yet centralized

Every route still constructs JSON response objects inline:

```typescript
{ status: "success", data: ... }
{ status: "error", message: ... }
```

**Files affected:** All `app/api/**/*.ts` route files.

**Recommendation:** Add small helpers in `lib/api.ts`:

```typescript
export function ok<T>(data: T) { return NextResponse.json({ status: "success", data }); }
export function err(message: string, status = 500) { return NextResponse.json({ status: "error", message }, { status }); }
```

---

### 1.4 Prisma error-code handling repeated

`P2025` (record not found) and `P2002` (unique constraint) checks are inline in multiple admin routes.

**Files affected:**
- `app/api/admin/hotlines/route.ts` (handles both `P2002` and `P2025`)
- `app/api/admin/grants/route.ts` (handles `P2025` only)
- `app/api/admin/applications/route.ts` (handles `P2025` only)

**Recommendation:** Centralize a `handlePrismaError(error, resourceName)` mapper that converts Prisma codes into standard `{ status, message, code }` responses.

---

## 2. Client-Side Page Redundancy

### 2.1 Admin CRUD pages are nearly identical

`app/(main)/admin/hotlines/page.tsx` and `app/(main)/admin/grants/page.tsx` share the same lifecycle:

- `useState` for list, loading, saving, error, editing, form fields.
- `fetchX` async function with `setLoading(true)`.
- `handleSubmit` with `confirm()`-less save, then refetch.
- `handleDelete` with `confirm()`.
- Inline form markup with the same input classes.
- Identical admin role guard and loading skeleton.

`app/(main)/admin/applications/page.tsx` is also structurally similar, though its mutation is status updates rather than full CRUD.

**Recommendation:** Build a generic `useAdminCrud(endpoint, schema)` hook and a reusable `AdminCrudPage<T>` component that accepts renderers for list items and forms.

---

### 2.2 Repeated admin role guard in client pages

```typescript
if (!session || session.user?.role !== "ADMIN") {
  return <div className="text-center text-error py-12">You do not have permission...</div>;
}
```

**Files affected:**
- `app/(main)/admin/page.tsx` (line ~49)
- `app/(main)/admin/hotlines/page.tsx` (line ~109)
- `app/(main)/admin/grants/page.tsx` (line ~130)
- `app/(main)/admin/applications/page.tsx` (line ~83)

**Recommendation:** Use a server-side `AdminLayout` or a client `useAdminGuard()` hook that returns a common `<AccessDenied />` component. Since the middleware already protects these routes, the client guard is defense-in-depth and can be centralized.

---

### 2.3 Inline type definitions duplicated from `lib/types.ts`

**Files affected:**
- `app/(main)/resources/page.tsx` redeclares `Hotline` and `Grant`.
- `app/(main)/stewardship/page.tsx` redeclares `OutreachResult` and `EscrowDocument`.
- `app/(main)/admin/hotlines/page.tsx` redeclares `Hotline`.
- `app/(main)/admin/grants/page.tsx` redeclares `Grant`.
- `app/(main)/admin/applications/page.tsx` redeclares `ProviderApplication`.

**Recommendation:** Move all domain types to `lib/types.ts` and import them in pages. This keeps `lib/types.ts` as the single source of truth.

---

## 3. Tailwind / UI Class Redundancy

### 3.1 Repeated input/textarea style string

The following class string is copied across 26+ locations:

```
bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3
 text-on-surface placeholder:text-on-surface-variant/50
 focus:ring-2 focus:ring-primary/50 outline-none
```

**Files affected (selection):**
- `app/(main)/stewardship/page.tsx` (lines 107, 112, 123, 167, 172, 183, 191)
- `app/(main)/sign-up/page.tsx` (lines 72, 80, 88)
- `app/(main)/sign-in/page.tsx` (lines 49, 57)
- `app/(main)/provider/apply/page.tsx` (lines 93, 99, 112, 119, 127)
- `app/(main)/admin/hotlines/page.tsx` (lines 127, 134, 141, 148)
- `app/(main)/admin/grants/page.tsx` (lines 148, 155, 162, 169, 176)

**Recommendation:** Create `components/ui/Input.tsx` and `components/ui/Textarea.tsx` that wrap these classes, accept all standard props, and add focus/aria states.

---

### 3.2 Repeated primary button / chip styles

Many pages inline button markup instead of reusing the existing `Button` and `Chip` components, or duplicate `rounded-full`, `bg-primary`, and shadow classes.

**Files affected:** `app/(main)/resources/page.tsx`, `app/(main)/navigate/page.tsx`, `app/(main)/stewardship/page.tsx`, `app/(main)/admin/**/*.tsx`.

**Recommendation:** Audit for any remaining hand-rolled button markup and replace with `components/ui/Button.tsx` or extend it with a new variant.

---

## 4. Agent Redundancy

### 4.1 Agent setup boilerplate

All five agents duplicate:

```typescript
const agent = new Agent({
  name: "...",
  description: "...",
  pricing: { type: "per-task", amount: 0.00, currency: "USD" }
});

agent.registerTool({ ... });

agent.start({ port: XXXX });
console.log(`... running on port XXXX`);
```

**Files affected:**
- `agents/luma-navigator.ts`
- `agents/luma-resources.ts`
- `agents/luma-community.ts`
- `agents/luma-escrow-manager.ts`
- `agents/luma-partner-outreach.ts`

**Recommendation:** Add a helper such as `createLumaAgent({ name, description, port, tools })` in `lib/agent-factory.ts` so each agent file only defines its unique tool logic.

---

### 4.2 OpenAI JSON-object parsing pattern

Both `luma-escrow-manager.ts` and `luma-partner-outreach.ts` use:

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [...],
  response_format: { type: "json_object" }
});

return { status: "success", ...: JSON.parse(response.choices[0].message.content || "{}"), billed_amount: 0.00 };
```

**Files affected:**
- `agents/luma-escrow-manager.ts` (lines ~25, ~28)
- `agents/luma-partner-outreach.ts` (lines ~25, ~28)

**Recommendation:** Add `callOpenAIJson(systemPrompt, userPrompt)` in `lib/openai.ts` that returns the parsed object and standardizes the success wrapper.

---

## 5. Business Logic Duplication Between Agents and API Routes

### 5.1 Provider matching logic

`agents/luma-community.ts` and `app/api/providers/route.ts` both implement the same provider-locale matching algorithm:

```typescript
providers.find((p) => p.locale === user_locale || p.locale.startsWith(user_locale.split("-")[0]))
```

**Recommendation:** Move the matching function into `lib/providers.ts` and have both the agent and the API route import it. The API route could also delegate entirely to the agent.

---

### 5.2 Resources lookup logic

`agents/luma-resources.ts` and `app/api/resources/route.ts` both:
1. Look up a hotline by locale (falling back to `US`).
2. List grants, optionally filtering by coverage.

**Recommendation:** Extract `getHotline(locale)` and `getGrants(locale)` helpers in `lib/resources.ts` and share them between the agent and the route.

---

### 5.3 Route-to-resources signal detection

`agents/luma-navigator.ts` (line 46) and `app/(main)/navigate/page.tsx` (line 58) both check for `[ROUTE_TO_RESOURCES]`. The page additionally checks `data.route_to_resources`, which the agent already computes.

**Recommendation:** The client should rely solely on the `route_to_resources` boolean returned by the agent; the string-matching check in the page is redundant.

---

## 6. Minor / Low-Priority Redundancy

| Redundancy | Files | Recommendation |
|---|---|---|
| `copyToClipboard` imported but unused in `navigate/page.tsx` | `app/(main)/navigate/page.tsx` line 8, `app/(main)/stewardship/page.tsx` line 7 | Remove the unused import in `navigate/page.tsx`. |
| `handleCopy` + timeout pattern only in stewardship | `app/(main)/stewardship/page.tsx` | Fine as-is, but could be a hook (`useCopyFeedback(delay)`). |
| `AlertCircle` + error text pattern in admin pages | `app/(main)/admin/hotlines/page.tsx`, `app/(main)/admin/grants/page.tsx`, `app/(main)/resources/page.tsx` | Create a reusable `<ErrorAlert message />` component. |
| Admin nav link + top-bar admin link both compute role | `components/layout/TopAppBar.tsx`, `components/layout/BottomNav.tsx` | Acceptable; if more role-based UI appears, create a `useAdmin()` hook. |
| `loading` state skeleton text is duplicated | `app/(main)/admin/**/*.tsx`, `app/(main)/resources/page.tsx` | Use a shared `<Loading text="..." />` component. |
| Package scripts for each agent | `package.json` | Add a single `agents:start` script using `concurrently` or a manifest. |
| `billed_amount: 0.00` in every agent | All agent files | Move to the agent factory helper or a shared constant. |
| `ApplicationStatusEnum` / `ProviderTypeEnum` in validation duplicate Prisma enums | `lib/validation.ts` | Derive from the Prisma client when possible or keep as a single source in validation and share. |

---

## 7. Suggested Refactoring Order

1. **High impact, low risk:** Centralize `Input`/`Textarea` components and the Tailwind class string.
2. **High impact, medium risk:** Build `withValidatedBody` / `withAdminRoute` wrappers and collapse API boilerplate.
3. **Medium impact:** Move duplicated types to `lib/types.ts`.
4. **Medium impact:** Create `lib/agent-factory.ts` and `lib/openai.ts` helpers to reduce agent duplication.
5. **Lower impact:** Generic `useAdminCrud` hook and shared admin UI components.
