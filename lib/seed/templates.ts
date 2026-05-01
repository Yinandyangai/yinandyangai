// lib/seed/templates.ts
//
// The 5 starter workflow templates. Each comes with a default graph that
// the AI synthesis step will customize for the user's specific business.

import type { WorkflowTemplate } from "../types";

export const SEED_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "tmpl-support",
    slug: "customer-support-triage",
    name: "Customer Support Triage",
    category: "customer-support",
    archetype: "AI Operations Manager",
    short_pitch: "Classify, route, and draft responses to every inbound email.",
    description_md: `
Watches your support inbox. On every new thread:

- **Classifies** the intent (refund, shipping, product, urgent, other)
- **Drafts** a response in your voice with relevant policy linked
- **Saves to drafts** for your review — nothing auto-sends

This is the highest-leverage first build for any business with customers.
`.trim(),
    default_graph: {
      version: 1,
      nodes: [
        {
          id: "n1",
          kind: "trigger",
          label: "New customer email",
          description: "Fires when a new thread lands in your support inbox.",
          config: { source: "gmail", folder: "Support" },
        },
        {
          id: "n2",
          kind: "ai-step",
          label: "Classify intent",
          description: "Tags as refund / shipping / product / urgent / other.",
          config: { model: "sonnet" },
        },
        {
          id: "n3",
          kind: "decision",
          label: "Urgent?",
          description: "If urgent, escalate. Otherwise, draft a reply.",
          config: { condition: "tag == 'urgent'" },
        },
        {
          id: "n4",
          kind: "ai-step",
          label: "Draft on-brand reply",
          description: "Writes a response in your voice.",
          config: { model: "sonnet" },
        },
        {
          id: "n5",
          kind: "output",
          label: "Save draft",
          description: "Saves to your inbox drafts for review.",
          config: { destination: "gmail-drafts" },
        },
      ],
      edges: [
        { from: "n1", to: "n2" },
        { from: "n2", to: "n3" },
        { from: "n3", to: "n4", condition: "tag != 'urgent'" },
        { from: "n4", to: "n5" },
      ],
    },
    required_tier: "free",
  },
  {
    id: "tmpl-leads",
    slug: "lead-qualifier",
    name: "Lead Qualifier",
    category: "lead-gen",
    archetype: "AI Sales Rep",
    short_pitch:
      "Score every inbound lead against your ICP and route it to the right reply.",
    description_md: `
On every new form submission:

- **Enriches** the lead (company, role, size — best-effort)
- **Scores** them against your ICP
- **Branches** into one of three replies: strong fit (book a call), soft fit (nurture sequence), no fit (polite decline)

Stops you wasting hours on leads who'll never close.
`.trim(),
    default_graph: {
      version: 1,
      nodes: [
        {
          id: "n1",
          kind: "trigger",
          label: "New form submission",
          description: "Fires on every inbound lead.",
          config: { source: "form" },
        },
        {
          id: "n2",
          kind: "tool-call",
          label: "Enrich lead",
          description: "Looks up company size, industry, and role.",
          config: { provider: "best-effort" },
        },
        {
          id: "n3",
          kind: "ai-step",
          label: "Score against ICP",
          description: "Returns: strong / soft / no fit, with a one-line reason.",
          config: { model: "sonnet" },
        },
        {
          id: "n4",
          kind: "decision",
          label: "Fit level?",
          description: "Routes to the right reply path.",
          config: { branches: ["strong", "soft", "no"] },
        },
        {
          id: "n5",
          kind: "ai-step",
          label: "Personal calendar invite",
          description: "Drafts a warm reply with calendar link.",
          config: { model: "sonnet" },
        },
        {
          id: "n6",
          kind: "ai-step",
          label: "Nurture reply",
          description: "Sends them into a 3-touch sequence.",
          config: { model: "haiku" },
        },
        {
          id: "n7",
          kind: "ai-step",
          label: "Polite decline",
          description: "Brief, kind, no calendar link.",
          config: { model: "haiku" },
        },
        {
          id: "n8",
          kind: "output",
          label: "Save & log",
          description: "Logs the decision for review.",
          config: { destination: "crm" },
        },
      ],
      edges: [
        { from: "n1", to: "n2" },
        { from: "n2", to: "n3" },
        { from: "n3", to: "n4" },
        { from: "n4", to: "n5", condition: "fit == 'strong'" },
        { from: "n4", to: "n6", condition: "fit == 'soft'" },
        { from: "n4", to: "n7", condition: "fit == 'no'" },
        { from: "n5", to: "n8" },
        { from: "n6", to: "n8" },
        { from: "n7", to: "n8" },
      ],
    },
    required_tier: "pro",
  },
  {
    id: "tmpl-content",
    slug: "content-repurposer",
    name: "Content Repurposer",
    category: "content",
    archetype: "AI Content Engine",
    short_pitch: "Turn one piece of content into ten platform-native atoms.",
    description_md: `
You drop in one source asset (essay, transcript, video). The workflow:

- **Extracts** the core ideas and quotable lines
- **Generates** platform-specific atoms: Twitter thread, LinkedIn post, newsletter blurb, short-form video script
- **Drafts** all of them in your voice for review

Distribution is a math problem. This workflow fixes the math.
`.trim(),
    default_graph: {
      version: 1,
      nodes: [
        {
          id: "n1",
          kind: "trigger",
          label: "New source asset",
          description: "You drop in an essay, transcript, or video URL.",
          config: { source: "upload" },
        },
        {
          id: "n2",
          kind: "ai-step",
          label: "Extract key ideas",
          description: "Pulls 3-5 main ideas and 5-10 quotable lines.",
          config: { model: "sonnet" },
        },
        {
          id: "n3",
          kind: "ai-step",
          label: "Twitter thread",
          description: "Drafts a thread in your voice.",
          config: { model: "sonnet", platform: "twitter" },
        },
        {
          id: "n4",
          kind: "ai-step",
          label: "LinkedIn post",
          description: "Single post, longer-form, professional voice.",
          config: { model: "sonnet", platform: "linkedin" },
        },
        {
          id: "n5",
          kind: "ai-step",
          label: "Newsletter blurb",
          description: "Short intro + link, your tone.",
          config: { model: "sonnet", platform: "newsletter" },
        },
        {
          id: "n6",
          kind: "output",
          label: "Save to drafts queue",
          description: "All atoms land in your review queue.",
          config: { destination: "drafts" },
        },
      ],
      edges: [
        { from: "n1", to: "n2" },
        { from: "n2", to: "n3" },
        { from: "n2", to: "n4" },
        { from: "n2", to: "n5" },
        { from: "n3", to: "n6" },
        { from: "n4", to: "n6" },
        { from: "n5", to: "n6" },
      ],
    },
    required_tier: "pro",
  },
  {
    id: "tmpl-digest",
    slug: "weekly-ops-digest",
    name: "Weekly Ops Digest",
    category: "ops",
    archetype: "AI Operations Manager",
    short_pitch:
      "Every Monday, get a one-page brief on what happened across your business.",
    description_md: `
Pulls data from your connected tools every Monday morning:

- **Sales** — what closed, what's in the pipeline
- **Customer** — top complaints, NPS shifts, churn signals
- **Content** — what performed, what flopped
- **Anomalies** — what changed week-over-week

Lands in your inbox at 7am Monday. Read in 4 minutes. Make better decisions.
`.trim(),
    default_graph: {
      version: 1,
      nodes: [
        {
          id: "n1",
          kind: "trigger",
          label: "Every Monday 7am",
          description: "Scheduled trigger.",
          config: { schedule: "0 7 * * 1" },
        },
        {
          id: "n2",
          kind: "tool-call",
          label: "Pull data from tools",
          description: "Reads from connected sales, support, and content sources.",
          config: { sources: ["crm", "support", "analytics"] },
        },
        {
          id: "n3",
          kind: "ai-step",
          label: "Synthesize digest",
          description: "Writes a one-page brief with anomaly callouts.",
          config: { model: "sonnet" },
        },
        {
          id: "n4",
          kind: "output",
          label: "Email to you",
          description: "Sends the digest to your inbox.",
          config: { destination: "email" },
        },
      ],
      edges: [
        { from: "n1", to: "n2" },
        { from: "n2", to: "n3" },
        { from: "n3", to: "n4" },
      ],
    },
    required_tier: "operator",
  },
  {
    id: "tmpl-inbox-zero",
    slug: "inbox-zero-agent",
    name: "Inbox Zero Agent",
    category: "ops",
    archetype: "AI Operations Manager",
    short_pitch:
      "Pre-sort your inbox every morning into reply / read / archive piles.",
    description_md: `
Every morning at 6am, before you wake up:

- **Reads** every email that arrived overnight
- **Sorts** into three piles: needs reply, FYI only, can archive
- **Drafts** suggested replies for the "needs reply" pile

You wake up to an inbox that's already triaged. The 30-minute morning email scroll becomes 5 minutes.
`.trim(),
    default_graph: {
      version: 1,
      nodes: [
        {
          id: "n1",
          kind: "trigger",
          label: "Every morning 6am",
          description: "Scheduled trigger.",
          config: { schedule: "0 6 * * *" },
        },
        {
          id: "n2",
          kind: "tool-call",
          label: "Pull overnight emails",
          description: "Reads emails received in the last 18 hours.",
          config: { source: "gmail" },
        },
        {
          id: "n3",
          kind: "ai-step",
          label: "Sort into piles",
          description: "Reply / FYI / archive — based on your prior patterns.",
          config: { model: "haiku" },
        },
        {
          id: "n4",
          kind: "ai-step",
          label: "Draft replies",
          description: "For the reply pile, drafts a response in your voice.",
          config: { model: "sonnet" },
        },
        {
          id: "n5",
          kind: "output",
          label: "Apply labels & save drafts",
          description: "Labels every email; drafts saved for review.",
          config: { destination: "gmail" },
        },
      ],
      edges: [
        { from: "n1", to: "n2" },
        { from: "n2", to: "n3" },
        { from: "n3", to: "n4" },
        { from: "n4", to: "n5" },
      ],
    },
    required_tier: "operator",
  },
];
