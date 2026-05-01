// lib/seed/lessons.ts
//
// The starter lesson library. These are seeded into the DB by an
// admin script (not included in this scaffold) — but the app reads from
// here as a fallback so the Learning Engine renders before you've connected
// Supabase.

import type { Lesson } from "../types";

export const SEED_LESSONS: Lesson[] = [
  {
    id: "seed-001",
    slug: "what-ai-is-actually-good-at",
    title: "What AI is actually good at",
    track: "fundamentals",
    position: 1,
    duration_min: 4,
    summary:
      "Cut through the noise. Here's the short list of tasks AI is genuinely better-than-human at — and the ones it isn't.",
    body_md: `
There are about a thousand articles arguing whether AI will take your job.
Skip them. Here's what matters for an operator running a real business.

**AI is genuinely good at:**

- Reading a lot of text and pulling out structure (classification, summarization, extraction)
- Drafting in a known voice from clear prompts (emails, social posts, descriptions)
- Routing — deciding what category a thing belongs to
- Pattern-matching against examples you give it

**AI is genuinely bad at:**

- Knowing things that happened recently
- Doing math reliably (it'll fake it confidently)
- Original strategic judgment about your specific business
- Anything where being wrong costs you a customer and there's no review step

**The operator's rule:** wherever you do something high-volume and low-judgment,
AI is a force multiplier. Wherever you do something low-volume and high-judgment,
AI is a tool, not a replacement.

In the next lesson we'll find your first AI-fit task in your business.
`.trim(),
    action_prompt: null,
    required_tier: "free",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-002",
    slug: "find-your-first-ai-fit-task",
    title: "Find your first AI-fit task",
    track: "fundamentals",
    position: 2,
    duration_min: 5,
    summary:
      "A 5-minute audit of your week to find the highest-leverage thing to automate first.",
    body_md: `
Pull up your calendar and inbox from the last 7 days. Answer three questions.

**1. What did you do that you do every week?**
Recurring tasks are AI-fit candidates. Custom one-offs are not.

**2. What did you do that drained you out of proportion to its difficulty?**
Inbox triage. Lead replies. Reformatting content. These are the wins.

**3. Where did you delay or drop the ball because you didn't have time?**
Follow-ups. Reporting. Onboarding emails. AI doesn't get tired.

Pick **one** task that hits all three. That's your first build. Don't overthink it —
the goal is to ship something that gives you back 30 minutes a week. We'll pick
something more ambitious for build #2.
`.trim(),
    action_prompt:
      "Based on the operator's business profile, suggest the single highest-leverage task to automate first. Give one specific recommendation with a one-sentence rationale.",
    required_tier: "free",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-003",
    slug: "the-prompt-as-a-spec",
    title: "The prompt is a spec, not a wish",
    track: "fundamentals",
    position: 3,
    duration_min: 4,
    summary:
      "Most prompts fail because they're written like requests. Write them like product specs and watch the quality jump.",
    body_md: `
A bad prompt: "Write me a marketing email."
A good prompt: "Write a 90-word email to past customers who haven't bought
in 60 days. Voice: warm, slightly informal. Include one specific reason to come
back. End with a question, not a CTA."

The difference is **constraint density**. Every constraint you add removes
ambiguity. Every removed ambiguity raises the floor of the output.

**The four constraints worth adding to almost every prompt:**

1. **Audience** — who's reading it
2. **Voice** — how it should sound (give 2-3 adjectives, not vague vibes)
3. **Length** — explicit word or sentence count
4. **One thing it must do** — and one thing it must not do

This is why Business-Aware AI matters in this platform. Three of those four
are already known about your business. You just supply the fourth.
`.trim(),
    action_prompt: null,
    required_tier: "free",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-004",
    slug: "customer-support-triage",
    title: "Triage your support inbox in 24 hours",
    track: "customer-ops",
    position: 1,
    duration_min: 6,
    summary:
      "The single most defensible AI build for any business with customers: an inbox triage layer that classifies, routes, and drafts.",
    body_md: `
If your business has more than 5 customer emails a day, this is your first build.

**What you're building:**
A workflow that watches your support inbox, classifies each thread (refund,
shipping question, product question, urgent), drafts a response in your voice,
and saves the draft. Nothing auto-sends. You review.

**Why this is the first build:**
- It pays back time immediately (every email saved is real minutes back)
- Classification is what AI is genuinely better-than-human at
- The risk is bounded — you review before sending
- It generates training data for future builds

**The catch:**
Garbage in, garbage out. Spend 10 minutes writing what your "voice" is. Two
or three example responses you'd send. The model needs anchors.

Click "Apply to my business" below and we'll generate the workflow tailored
to your industry, then walk through it node by node.
`.trim(),
    action_prompt:
      "Generate a customer-support triage workflow for this operator. The graph should have a trigger (new email), an AI classification step, a decision branch for urgent vs non-urgent, an AI drafting step, and a draft-save output. Tailor the classification categories and voice notes to their industry.",
    required_tier: "free",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-005",
    slug: "lead-qualification-without-a-bdr",
    title: "Lead qualification without a BDR",
    track: "sales",
    position: 1,
    duration_min: 5,
    summary:
      "Most operators waste hours on leads who'll never close. Here's the AI workflow that filters them in 60 seconds.",
    body_md: `
A solo founder talking to every lead is a $5,000 mistake at scale. A junior BDR
costs $4,500 a month and burns out. The third option:

**A workflow that, on every new lead form submission, looks up the company,
scores fit against your ICP, and writes one of three replies:**
1. *Strong fit:* book directly into your calendar with a personal note.
2. *Soft fit:* send a nurture sequence and tag for monthly review.
3. *No fit:* polite, brief, no calendar link.

**The trick that makes this work:**
Your ICP definition has to be honest. Three sentences max:
- Who they are (role + company size)
- What they're trying to do
- What disqualifies them

If you can't say it in three sentences, you don't have an ICP — you have hopes.
Fix that first. Then build the workflow.
`.trim(),
    action_prompt:
      "Generate a lead-qualification workflow for this operator. Trigger: new form submission. Steps: enrichment lookup, ICP scoring, branched response (strong/soft/no fit). Tailor the ICP scoring to their industry and audience.",
    required_tier: "pro",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-006",
    slug: "content-repurposing-engine",
    title: "Turn one piece of content into ten",
    track: "content",
    position: 1,
    duration_min: 5,
    summary:
      "The leverage move for any creator or founder: a pipeline that takes one core asset and atomizes it across every channel.",
    body_md: `
You record one podcast. You write one essay. You ship one product update.
Now you need to be present on Twitter, LinkedIn, Instagram, your newsletter,
and YouTube Shorts. This is a math problem, not a creativity problem.

**The repurposing engine:**
1. You drop the source asset (transcript, doc, or video).
2. The workflow extracts the core ideas.
3. It generates platform-specific atoms — but in your voice, with your formatting.
4. It saves drafts to a queue for review. Nothing auto-posts.

**Why this matters more than it sounds:**
The operators who win on content aren't the ones who create more — they're the
ones who *distribute* more from the same creation. This workflow flips your ratio.

One asset → ten posts is the conservative output. Done well, it's twenty.
`.trim(),
    action_prompt:
      "Generate a content repurposing workflow for this operator. Trigger: new source asset uploaded. Steps: extract key ideas, generate platform-specific atoms (Twitter thread, LinkedIn post, newsletter blurb, short-form video script), save to drafts. Tailor voice and formatting to their industry.",
    required_tier: "pro",
    published: true,
    created_at: new Date().toISOString(),
  },
];
