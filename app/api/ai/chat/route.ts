// app/api/ai/chat/route.ts
//
// The single server-side door to the AI layer. Every product feature that
// needs AI hits this route — never the providers directly.
//
// We validate the request, forward to runAI, and return the AIResponse JSON.
// In mock mode (no API keys) runAI itself returns deterministic stubs, so
// this route works end-to-end on a fresh clone with zero secrets.
//
// Runtime: Node (default). We intentionally don't go Edge yet because the
// Anthropic + OpenAI SDKs expect Node primitives in some code paths.

import { NextResponse } from "next/server";
import { z } from "zod";
import { runAI } from "@/lib/ai";
import type { AIRequest } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── Request schema ───────────────────────────────────────────────────────────
const TASKS = [
  "lesson-personalization",
  "workflow-synthesis",
  "agent-execution",
  "recommendation",
] as const;

const SCHEMAS = ["WorkflowGraph", "RecommendationList"] as const;

const RequestSchema = z.object({
  task: z.enum(TASKS),
  input: z.string().min(1).max(20_000),
  schema: z.enum(SCHEMAS).optional().nullable(),
  // businessContext is intentionally NOT accepted from the client — it must
  // be loaded server-side from the authed user's session in Phase 1.
  // For Phase 0 it's always null and runAI handles that.
});

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = RequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request.",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  // Phase 1 will load BusinessProfile from Supabase using the session.
  // Phase 0: pass null and let the system prompt fall back to the
  // generic-operator framing.
  const aiReq: AIRequest = {
    task: parsed.data.task,
    input: parsed.data.input,
    schema: parsed.data.schema ?? null,
    businessContext: null,
  };

  try {
    const response = await runAI(aiReq);
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown AI error.";
    // Fail loud server-side, fail soft client-side. Don't leak provider
    // internals to the browser.
    console.error("[/api/ai/chat] runAI failed:", message);
    return NextResponse.json(
      { error: "AI request failed. Try again or contact support." },
      { status: 502 },
    );
  }
}
