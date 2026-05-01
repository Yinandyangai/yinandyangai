# yinandyang.ai

> The operating system for AI-native businesses.

A platform that takes an operator with zero AI experience and turns them into someone running an AI-leveraged business — through interactive learning, business-aware implementation, and a system builder that converts plain English into working AI workflows.

This is not a course. Not a tool directory. It's an execution system.

---

## The duality

Every product decision returns to two axes. The brand isn't decoration — it's the navigation.

| Yin (human) | Yang (machine) |
|---|---|
| Learning | Doing |
| Strategy | Execution |
| Intuition | Intelligence |
| Concept | System |

Every screen sits on this spectrum. Every feature pulls one toward the other.

---

## Four layers (full vision)

1. **Clarity Layer — AI Learning Engine.** Interactive, business-flavored lessons. No theory dumps. *Concept → example → use case → action.* "Explain like I run a business."
2. **Execution Layer — Implementation Engine.** Step-by-step guided builds for the workflows that actually matter: customer support automation, lead gen, content pipelines, internal copilots. The platform reads your business profile and adapts every instruction.
3. **Creation Layer — AI System Builder.** Hybrid prompt-first / visual builder. Describe the system; see it materialize; edit the nodes. Pre-built archetypes: AI Sales Rep, AI Operations Manager, AI Content Engine.
4. **Integration Layer — Operating System Dashboard.** Mission control. Active systems, performance, AI Readiness Score, next-step recommendations from the Continuous Evolution Engine.

---

## What's in this scaffold

This repository is the **MVP foundation** — the vertical slice that proves the whole thesis on day one and sets up every other layer to be added without rewrites.

```
yinandyang/
├── README.md                    ← you are here
├── ARCHITECTURE.md              ← full architecture, data flow, AI layer design
├── BUILD_PLAN.md                ← phased plan, 0 → launch
├── supabase/schema.sql          ← Postgres schema (auth, business, lessons, workflows, runs)
├── app/
│   ├── page.tsx                 ← landing page (marketing)
│   ├── (app)/
│   │   ├── onboarding/          ← business profile capture (powers Business-Aware AI)
│   │   ├── dashboard/           ← mission control + Readiness Score + Next Action
│   │   ├── learn/               ← Learning Engine (lesson list + lesson view)
│   │   └── build/               ← Implementation Engine (template list + Build With Me)
│   └── api/ai/chat/             ← AI route (multi-model, server-side)
├── components/                  ← duality-mark, readiness-score, build-with-me, next-action
├── lib/
│   ├── ai.ts                    ← multi-model abstraction (OpenAI + Anthropic)
│   ├── business-context.ts      ← injects business profile into every AI call
│   ├── supabase.ts              ← typed DB client
│   ├── types.ts                 ← shared types
│   └── seed/                    ← starter lessons + workflow templates
└── ...config (next, tailwind, ts, env)
```

---

## Decisions already made (so we don't re-litigate)

- **Builder type: hybrid, prompt-first.** User describes the workflow in plain English. The platform synthesizes a visual graph of steps the user can review and edit node-by-node. Pure drag-and-drop is too intimidating for non-technical operators; pure prompt is too opaque. The wow moment is *describe → see it materialize*.
- **Business model: Free / Pro $29 / Operator $99 / Done-with-you $499+**. Free = 3 lessons + 1 active workflow. Pro = full learning library + 5 active workflows + AI usage included up to a cap. Operator = unlimited workflows + integrations + analytics + priority models. Done-with-you is a service tier with a real human (initially you).
- **Stack: Next.js 14 App Router, Tailwind, Postgres (Supabase), Vercel.** Multi-model AI through a single internal abstraction so we can swap providers per task without changing product code.
- **Aesthetic: editorial minimalism with duality as the literal design system.** Fraunces serif + Geist sans, warm paper + ink, single ochre accent. No purple gradients. No glassmorphism. Calm.

---

## Run it locally

```bash
# 1. Install
npm install

# 2. Copy env template and fill in keys (Supabase, OpenAI/Anthropic — both optional for first boot)
cp .env.example .env.local

# 3. Apply the schema
# In Supabase SQL editor: paste & run supabase/schema.sql
# Or via psql: psql "$DATABASE_URL" < supabase/schema.sql

# 4. Run
npm run dev
```

The app boots without API keys. Lessons and templates render from seed data. AI calls fall back to a deterministic mock so you can click through every flow before paying for tokens.

---

## What to build next (after running this scaffold)

See `BUILD_PLAN.md` — phased from "stand it up locally" through "first 100 paying operators".
