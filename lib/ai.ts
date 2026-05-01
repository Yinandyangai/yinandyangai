// lib/ai.ts
//
// Single internal abstraction for every AI call in the product.
// Product code calls `runAI({ task, input, businessContext })`.
// This file decides which provider/model to use and handles mock-mode.
//
// Why this matters: the rest of the codebase never names a model.
// We swap providers per task, A/B test routes, and re-price without touching
// product code.

import type { AIRequest, AIResponse, AITask } from "./types";
import { buildSystemPrompt } from "./business-context";

// ─── Routing table ───────────────────────────────────────────────────────────
// Each task picks its preferred provider and a model id.
// Cost numbers are rough-cut; replace with live values when you wire pricing.
const ROUTING: Record<
  AITask,
  { provider: "openai" | "anthropic"; model: string; max_tokens: number }
> = {
  // Quick personalization of lesson examples — fast & cheap
  "lesson-personalization": {
    provider: "anthropic",
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
  },
  // The big one: turn natural-language description into a WorkflowGraph
  "workflow-synthesis": {
    provider: "anthropic",
    model: "claude-opus-4-7",
    max_tokens: 2400,
  },
  // Running an actual workflow step
  "agent-execution": {
    provider: "anthropic",
    model: "claude-sonnet-4-6",
    max_tokens: 1600,
  },
  // Continuous Evolution recommendations — structured, fast
  recommendation: {
    provider: "openai",
    model: "gpt-4o-mini",
    max_tokens: 600,
  },
};

// ─── Public entry point ──────────────────────────────────────────────────────
export async function runAI(req: AIRequest): Promise<AIResponse> {
  const route = ROUTING[req.task];
  const haveOpenAI = !!process.env.OPENAI_API_KEY;
  const haveAnthropic = !!process.env.ANTHROPIC_API_KEY;

  // Mock mode if neither key is set, OR if the chosen provider's key is missing.
  if (
    (!haveOpenAI && !haveAnthropic) ||
    (route.provider === "openai" && !haveOpenAI) ||
    (route.provider === "anthropic" && !haveAnthropic)
  ) {
    return mockResponse(req);
  }

  const t0 = Date.now();
  const system = buildSystemPrompt(req.businessContext);

  if (route.provider === "anthropic") {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    const result = await client.messages.create({
      model: route.model,
      max_tokens: route.max_tokens,
      system,
      messages: [{ role: "user", content: req.input }],
    });

    const text = result.content
      .filter((b): b is { type: "text"; text: string } => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return finalize({
      text,
      schema: req.schema,
      model: route.model,
      tokens_in: result.usage?.input_tokens ?? 0,
      tokens_out: result.usage?.output_tokens ?? 0,
      latency_ms: Date.now() - t0,
    });
  }

  // OpenAI branch
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const result = await client.chat.completions.create({
    model: route.model,
    max_tokens: route.max_tokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: req.input },
    ],
  });

  return finalize({
    text: result.choices[0]?.message?.content ?? "",
    schema: req.schema,
    model: route.model,
    tokens_in: result.usage?.prompt_tokens ?? 0,
    tokens_out: result.usage?.completion_tokens ?? 0,
    latency_ms: Date.now() - t0,
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function finalize(args: {
  text: string;
  schema: AIRequest["schema"];
  model: string;
  tokens_in: number;
  tokens_out: number;
  latency_ms: number;
}): AIResponse {
  let parsed: unknown = undefined;
  if (args.schema) {
    parsed = tryParseJSON(args.text);
  }
  return {
    text: args.text,
    parsed,
    model: args.model,
    tokens_in: args.tokens_in,
    tokens_out: args.tokens_out,
    cost_usd: estimateCost(args.model, args.tokens_in, args.tokens_out),
    latency_ms: args.latency_ms,
  };
}

function tryParseJSON(s: string): unknown {
  // Models often wrap JSON in fences. Strip them.
  const cleaned = s
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to find a {…} or […] block in the text
    const match = cleaned.match(/[\[{][\s\S]*[\]}]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function estimateCost(model: string, tin: number, tout: number): number {
  // Rough $/1M tokens. Replace with live pricing later.
  const rates: Record<string, [number, number]> = {
    "claude-haiku-4-5-20251001": [1, 5],
    "claude-sonnet-4-6": [3, 15],
    "claude-opus-4-7": [15, 75],
    "gpt-4o-mini": [0.15, 0.6],
    "gpt-4o": [2.5, 10],
  };
  const [pin, pout] = rates[model] ?? [2, 8];
  return Number(((tin / 1_000_000) * pin + (tout / 1_000_000) * pout).toFixed(4));
}

// ─── Mock mode ───────────────────────────────────────────────────────────────
// Deterministic so the UI is fully clickable without API keys.
function mockResponse(req: AIRequest): AIResponse {
  const text = (() => {
    switch (req.task) {
      case "lesson-personalization":
        return `Here's how this applies to ${
          req.businessContext?.name ?? "your business"
        }: focus on the highest-volume, lowest-judgment task in your day. For most operators that's inbox triage, lead qualification, or weekly reporting. Pick one. We'll build it together.`;

      case "workflow-synthesis":
        return JSON.stringify(MOCK_GRAPH, null, 2);

      case "agent-execution":
        return `[mock run]\nInput received and processed.\nNext step: review the suggested response in your inbox.\n— yinandyang`;

      case "recommendation":
        return JSON.stringify(
          [
            {
              kind: "new_workflow",
              title: "Build a weekly ops digest",
              rationale:
                "You haven't set up any reporting workflows. A weekly digest gives you visibility without effort.",
              cta_label: "Build it",
              cta_target: "/build/weekly-ops-digest",
              priority: 80,
            },
          ],
          null,
          2
        );
    }
  })();

  return {
    text,
    parsed: req.schema ? tryParseJSON(text) : undefined,
    model: "mock",
    tokens_in: 0,
    tokens_out: 0,
    cost_usd: 0,
    latency_ms: 8,
    mock: true,
  };
}

// A representative graph used in mock mode — gives the Build With Me flow
// something real to render.
const MOCK_GRAPH = {
  version: 1,
  nodes: [
    {
      id: "trigger-1",
      kind: "trigger",
      label: "New customer email arrives",
      description: "Watches the support inbox and fires on every new thread.",
      config: { source: "gmail", folder: "Support" },
    },
    {
      id: "ai-1",
      kind: "ai-step",
      label: "Classify intent & urgency",
      description:
        "Reads the email and tags it: refund, shipping, product question, urgent.",
      config: {
        model: "sonnet",
        prompt:
          "Classify this email into one of: refund, shipping, product, urgent, other. Respond with the tag only.",
      },
    },
    {
      id: "decide-1",
      kind: "decision",
      label: "Urgent?",
      description: "If urgent, escalate. Otherwise, draft a reply.",
      config: { condition: "tag == 'urgent'" },
    },
    {
      id: "ai-2",
      kind: "ai-step",
      label: "Draft on-brand reply",
      description: "Writes a response in your voice, with relevant policy linked.",
      config: { model: "sonnet" },
    },
    {
      id: "out-1",
      kind: "output",
      label: "Save draft to inbox",
      description: "You review & send. Nothing auto-sends without approval.",
      config: { destination: "gmail-drafts" },
    },
  ],
  edges: [
    { from: "trigger-1", to: "ai-1" },
    { from: "ai-1", to: "decide-1" },
    { from: "decide-1", to: "ai-2", condition: "tag != 'urgent'" },
    { from: "ai-2", to: "out-1" },
  ],
};
