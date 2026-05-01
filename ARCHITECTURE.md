# Architecture

This is the system spec. If something in the code disagrees with this doc, the doc is the source of truth — fix the code.

---

## 1. Product architecture (the four layers)

```
                            ┌─────────────────────────────────┐
                            │   Operating System Dashboard    │  ← Integration Layer
                            │   "what's running, what's next" │
                            └──────────────┬──────────────────┘
                                           │
            ┌──────────────────────────────┼──────────────────────────────┐
            │                              │                              │
   ┌────────▼─────────┐         ┌──────────▼──────────┐         ┌─────────▼────────┐
   │  Learning Engine │         │ Implementation      │         │  System Builder  │
   │  (Clarity)       │         │ Engine (Execution)  │         │  (Creation)      │
   │                  │         │                     │         │                  │
   │ concept→action   │         │ guided real builds  │         │ prompt → graph   │
   │ lessons          │         │ business-adapted    │         │ editable agents  │
   └──────────────────┘         └─────────────────────┘         └──────────────────┘
                                           │
                              ┌────────────▼────────────┐
                              │  Business Context Core  │
                              │  (industry, goals,      │
                              │   tools, constraints)   │
                              └─────────────────────────┘
```

**The Business Context Core is the differentiator.** Every other layer reads from it. Every AI call gets it injected. This is what "Business-Aware AI" actually means in implementation.

---

## 2. The data model (high level)

Five concepts. Everything else is a join table or an audit row.

| Table | Owns |
|---|---|
| `users` | Identity (Supabase Auth) |
| `businesses` | The Business Context Core. One per user (for now). Industry, goals, current tools, audience, constraints. |
| `lessons` | Static-ish content for the Learning Engine. Versioned. Markdown body + structured "actions". |
| `workflows` | A user's instance of a system they're building or running. Has a `template_id` it was forked from, a `graph` (the editable structure), and `status`. |
| `workflow_runs` | Each execution of a workflow. Inputs, outputs, AI tokens, latency, cost. This is what powers the Readiness Score and the Continuous Evolution Engine. |

Full DDL in `supabase/schema.sql`.

---

## 3. Information architecture (routes)

```
/                            ← marketing landing
/login                       ← auth
/onboarding                  ← business profile capture (5 questions, < 2 min)
/dashboard                   ← mission control
/learn                       ← lesson library
/learn/[slug]                ← lesson view + "apply to my business" CTA
/build                       ← template gallery + recently built
/build/[template]            ← Build With Me — guided creation
/build/workflow/[id]         ← edit / inspect an existing workflow
/settings                    ← business profile, billing, integrations
```

Marketing site lives at `/`. App lives under the `(app)` route group with shared layout (sidebar + breadcrumb + status).

---

## 4. The AI layer

Single internal abstraction: `lib/ai.ts` exposes one function — `runAI({ task, input, businessContext })`. Inside, it routes to the right model:

- **`task: 'lesson-personalization'`** → fast, cheap (Haiku / 4o-mini)
- **`task: 'workflow-synthesis'`** → highest reasoning (Opus / o-class)
- **`task: 'agent-execution'`** → balanced (Sonnet / 4o)
- **`task: 'recommendation'`** → fast, structured output (Haiku / 4o-mini)

Why this matters: product code never names a model. We swap providers, A/B test routes, and re-price without touching the surface.

**Business context injection.** Every call goes through `lib/business-context.ts` which prepends a system block built from the user's `businesses` row. So when the user is reading a lesson on "automating customer support" and clicks *Apply to my business*, the AI already knows they sell handmade ceramics, run on Shopify, and want to automate refund triage. No prompt engineering required from the user — that's the whole point.

**Server-side only.** Keys never leave the edge function. The client calls `/api/ai/chat` with a `task` and `input`; the route does context injection, model selection, streaming, and returns SSE.

**Mock mode.** When no API keys are configured, `runAI` returns deterministic stubbed responses so the UI is fully clickable from the first `npm run dev`. This keeps onboarding new contributors (and pre-funding development) free.

---

## 5. Signature features — implementation notes

### "Build With Me" mode
A guided wizard inside `/build/[template]`. State machine: `framing → context-check → synthesis → review → activate`. The AI streams its synthesis into a graph component live. User can intervene at every step. This is the highest-emotional-impact moment in the product — treat it like a launch sequence, not a form.

### Business-Aware AI
Implemented as `lib/business-context.ts:buildSystemPrompt(business)`. Injected into every server-side AI call. Cached per session.

### Prompt-to-System Conversion
A specialized AI route: `task: 'workflow-synthesis'`. Input is a natural-language description; output is a structured `graph` (typed in `lib/types.ts` as `WorkflowGraph`). The graph renders as visual nodes the user can edit. Saving a graph creates a `workflows` row. Activating it makes it executable via `workflow_runs`.

### AI Readiness Score
A 0–100 number derived from:
- breadth (how many distinct workflow categories the user has active) — 40 pts
- depth (run frequency × success rate over last 30 days) — 30 pts
- learning progress (lessons completed in their relevance bucket) — 20 pts
- integration count (connected tools) — 10 pts

Computed in a Postgres view (`v_readiness_score`) so it's always fresh and joinable. Surfaced on the dashboard as the most prominent number on the page.

### Continuous Evolution Engine
A scheduled job (Vercel cron, weekly) that:
1. Reads each business's `workflow_runs` and identifies bottlenecks (high latency, high cost, low success rate).
2. Reads what they *don't* have (no content workflow but they're a creator? no support workflow but they have customers?).
3. Generates 1–3 ranked recommendations per business via `task: 'recommendation'`.
4. Writes to a `recommendations` table; surfaces the top one on the dashboard as "Next Action".

This is the loop that makes the platform compound in value. Every run sharpens the next recommendation.

---

## 6. Tech stack — concrete versions

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 App Router | Server components for AI streaming, edge functions, file-based routing |
| Styling | Tailwind CSS 3 + CSS variables | Variables for theming, Tailwind for velocity |
| UI primitives | Hand-rolled (shadcn-style) | We need ~6 primitives. Adding shadcn CLI is overhead for v1. |
| DB | Postgres via Supabase | Auth + DB + storage + RLS in one. RLS is non-optional for multi-tenant SaaS. |
| Auth | Supabase Auth (email + Google) | Same provider, no extra service |
| AI | OpenAI + Anthropic, abstracted | Multi-provider from day one — never lock to one |
| Hosting | Vercel | Edge runtime + cron + preview deploys |
| Payments | Stripe (added in Phase 2) | Standard. Don't over-architect billing for v1. |

---

## 7. Security & multi-tenancy

- **RLS on every user-owned table.** `businesses`, `workflows`, `workflow_runs`, `recommendations`. Policy: `user_id = auth.uid()`. The schema file enforces this.
- **AI calls server-only.** No API keys in the browser. Ever.
- **Workflow execution isolation.** Each `workflow_run` is scoped to its `business_id`; the AI context is rebuilt server-side per run, never trusted from the client.
- **Audit log.** Every workflow run is a permanent row. We can replay, debug, and bill from it.

---

## 8. What's deliberately NOT in the MVP

To stay lean:
- No team accounts (single user per business). Add when 5%+ of paying users ask.
- No public marketplace for templates. Curated only.
- No webhook/integration platform. The "integrations" in v1 are direct API calls inside workflow steps.
- No mobile-native app. Mobile-responsive web.
- No real-time collaboration on workflows.

These aren't "never" — they're "not until we've nailed the core loop".

---

## 9. The compounding flywheel

The product gets better the more you use it. This is the long-term moat:

```
business profile → better lessons → applied to workflows
                                        ↓
                                   workflow runs
                                        ↓
                        run data (latency, cost, success)
                                        ↓
                     Continuous Evolution recommendations
                                        ↓
                               new workflows built
                                        ↓
                          richer business profile ↑
```

Every user who runs a workflow makes the platform smarter for that user. Every cohort of users sharpens the recommendation models. This is why the data model puts `workflow_runs` at the center.
