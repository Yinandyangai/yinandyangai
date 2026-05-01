# Build Plan

Phased. Each phase has a definition of done. Don't move to the next phase before the current one is real.

---

## Phase 0 — Stand it up locally (this week)

**Goal:** Run the scaffold, see the duality, click through the flows.

- [ ] `npm install` succeeds
- [ ] `npm run dev` boots on `localhost:3000`
- [ ] Landing page renders with the brand
- [ ] You can navigate to `/onboarding`, `/dashboard`, `/learn`, `/build` (auth not enforced yet)
- [ ] At least one lesson and one template render from seed data
- [ ] `/api/ai/chat` returns mock responses without API keys

**Done when:** you can record a 60-second clickthrough that feels like the product.

---

## Phase 1 — Real auth + real data (next 1–2 weeks)

**Goal:** A real user can sign up, save a business profile, and have it persist.

- [ ] Provision a Supabase project
- [ ] Run `supabase/schema.sql` against it
- [ ] Wire `lib/supabase.ts` to live keys
- [ ] Implement Supabase Auth (magic link first; Google second)
- [ ] `middleware.ts` enforces auth on `(app)` routes
- [ ] Onboarding form writes to `businesses` table
- [ ] Dashboard reads the live business and shows real (still mock) Readiness Score

**Done when:** you can sign up, complete onboarding, log out, log back in, and your business profile is still there.

---

## Phase 2 — One real loop end-to-end (weeks 3–4)

**Goal:** A user can pick the "Customer Support Triage" template, run Build With Me, save a workflow, and execute it once with real AI.

- [ ] OpenAI or Anthropic API key configured
- [ ] `lib/ai.ts` makes real calls (remove mock for `workflow-synthesis` and `agent-execution`)
- [ ] `/build/[template]` Build With Me wizard works end-to-end
- [ ] Saving a workflow writes to `workflows` table
- [ ] An "Activate & Run Once" button creates a `workflow_runs` row with real output
- [ ] The dashboard reflects the new workflow and a non-zero Readiness Score

**Done when:** a friend who's never seen the product can sign up, build their first AI workflow, and run it — in under 10 minutes.

This is the moment of truth. If this is magical, you have a product. If it's clunky, fix it before adding anything else.

---

## Phase 3 — Content + 5 templates (weeks 5–6)

**Goal:** Enough material that someone can spend a real session inside the product.

- [ ] 12 lessons live across 4 tracks: AI Fundamentals, Customer Ops, Sales & Lead Gen, Content Pipelines
- [ ] 5 templates: Customer Support Triage, Lead Qualifier, Content Repurposer, Weekly Ops Digest, Inbox Zero Agent
- [ ] Each lesson has at least one "Apply to my business" CTA that pre-fills a relevant template
- [ ] Continuous Evolution Engine (recommendations table + cron job) live with simple rule-based v0 logic

**Done when:** you can hand the URL to 10 operator friends and they don't run out of things to do in the first hour.

---

## Phase 4 — Billing + tiers (week 7)

**Goal:** Take money. Real money.

- [ ] Stripe integrated (Checkout + Customer Portal)
- [ ] `subscriptions` table mirrors Stripe state via webhooks
- [ ] Free tier limits enforced server-side (3 lessons, 1 active workflow)
- [ ] Pro tier unlocks library + 5 workflows
- [ ] Operator tier unlocks unlimited
- [ ] Pricing page at `/pricing` with the duality framing

**Done when:** the first paying customer's card has actually charged.

---

## Phase 5 — Public launch (week 8)

**Goal:** First 100 paying operators.

- [ ] Polish landing page; record demo video
- [ ] Producthunt + IndieHackers launch posts ready
- [ ] Email capture on landing → onboarding sequence (3 emails)
- [ ] Analytics: PostHog or Plausible. Track: signup → onboarding complete → first workflow built → first run → first paid week
- [ ] Soft launch to your audience first, iterate, then public launch

**Done when:** 100 paying customers, or you've learned exactly why not.

---

## Phase 6+ — The compounding part

In rough priority order, but reorder based on what paying users actually demand:

1. **Integrations** — Gmail, Slack, HubSpot, Notion, Stripe. The workflows get 10× more valuable when they touch real systems.
2. **Visual graph editor** — for the workflow nodes. This is where you re-revisit drag-and-drop.
3. **Multi-step agent runtime** — workflows that can loop, branch, and call other workflows.
4. **Team accounts** — when 5%+ of paying users ask.
5. **Template marketplace** — users publish their own.
6. **API + SDK** — when developers start asking how to extend the platform.
7. **Done-with-you tier productization** — turn the service tier into a higher-margin offering with playbooks and a small team.

---

## The discipline

A few principles to hold yourself to as you build this in Cursor:

1. **Every feature you ship should make the next recommendation smarter.** If it doesn't feed the flywheel, defer it.
2. **No feature without a job-to-be-done from the operator's day.** "It would be cool if..." goes in a separate file you reread monthly, not into the sprint.
3. **The dashboard is sacred.** It's the screen users will look at every morning. Don't pile features onto it. Curate it ruthlessly.
4. **Ship the lesson before the system.** A user who reads about an AI workflow and then builds it inside the same session is the entire thesis. Don't break that flow.
5. **Mock mode is not a hack — it's a feature.** Every contributor (including future you on a plane) should be able to clone, install, and click through the product without paying a token. Protect this.
