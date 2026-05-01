"use client";

// components/build-with-me.tsx
//
// The "Build With Me" sequence. The thesis of the product condenses here:
// describe → see it materialize → tweak → activate.
//
// State machine:
//   framing → context-check → synthesis → review → activate
//
// Synthesis streams a WorkflowGraph from /api/ai/chat (task: workflow-synthesis).
// In mock mode this returns a representative graph so the flow is fully
// clickable without API keys.

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { WorkflowGraph, WorkflowTemplate } from "@/lib/types";

type Phase = "framing" | "context-check" | "synthesis" | "review" | "activate";

interface Props {
  template: WorkflowTemplate;
}

export function BuildWithMe({ template }: Props) {
  const [phase, setPhase] = useState<Phase>("framing");
  const [refinement, setRefinement] = useState("");
  const [graph, setGraph] = useState<WorkflowGraph>(template.default_graph);
  const [synthesizing, setSynthesizing] = useState(false);

  async function synthesize() {
    setPhase("synthesis");
    setSynthesizing(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          task: "workflow-synthesis",
          input:
            `Customize this workflow template for the operator.\n\n` +
            `Template: ${template.name}\n` +
            `Archetype: ${template.archetype}\n\n` +
            `Operator's refinement: ${refinement || "(use defaults)"}\n\n` +
            `Return a WorkflowGraph as JSON with the keys: version, nodes, edges. ` +
            `Each node has id, kind, label, description, config.`,
          schema: "WorkflowGraph",
        }),
      });
      const data = await res.json();
      if (data?.parsed && Array.isArray(data.parsed.nodes)) {
        setGraph(data.parsed as WorkflowGraph);
      }
    } catch {
      // Keep the default graph on error — mock mode handles the happy path.
    } finally {
      setSynthesizing(false);
      setPhase("review");
    }
  }

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16">
      <Stepper phase={phase} />

      <div className="min-h-[420px]">
        {phase === "framing" && (
          <Framing
            template={template}
            onNext={() => setPhase("context-check")}
          />
        )}
        {phase === "context-check" && (
          <ContextCheck
            refinement={refinement}
            setRefinement={setRefinement}
            onBack={() => setPhase("framing")}
            onNext={synthesize}
          />
        )}
        {phase === "synthesis" && <Synthesis active={synthesizing} />}
        {phase === "review" && (
          <Review
            graph={graph}
            onBack={() => setPhase("context-check")}
            onActivate={() => setPhase("activate")}
          />
        )}
        {phase === "activate" && <Activate template={template} />}
      </div>
    </div>
  );
}

// ─── Step 0: stepper sidebar ─────────────────────────────────────────────────
const STEPS: { key: Phase; label: string }[] = [
  { key: "framing", label: "What you're building" },
  { key: "context-check", label: "Make it yours" },
  { key: "synthesis", label: "Materialize" },
  { key: "review", label: "Review the system" },
  { key: "activate", label: "Activate" },
];

function Stepper({ phase }: { phase: Phase }) {
  const idx = STEPS.findIndex((s) => s.key === phase);
  return (
    <ol className="hidden lg:flex flex-col gap-1 sticky top-24 self-start">
      {STEPS.map((s, i) => {
        const state =
          i < idx ? "done" : i === idx ? "current" : "future";
        return (
          <li
            key={s.key}
            className={cn(
              "flex items-center gap-3 py-2 text-sm transition-colors",
              state === "current" && "text-ink",
              state === "done" && "text-ink-mute",
              state === "future" && "text-ink-faint"
            )}
          >
            <span
              className={cn(
                "inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] tabular-nums border",
                state === "current" && "bg-ink text-paper border-ink",
                state === "done" && "bg-paper border-ink-mute",
                state === "future" && "border-paper-edge"
              )}
            >
              {state === "done" ? "✓" : i + 1}
            </span>
            {s.label}
          </li>
        );
      })}
    </ol>
  );
}

// ─── Step 1: framing ─────────────────────────────────────────────────────────
function Framing({
  template,
  onNext,
}: {
  template: WorkflowTemplate;
  onNext: () => void;
}) {
  return (
    <section className="flex flex-col gap-8 animate-fade-up">
      <div className="flex flex-col gap-3">
        <span className="text-[11px] uppercase tracking-widest text-ochre-deep">
          {template.archetype}
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight leading-[1.05]">
          {template.name}
        </h1>
        <p className="text-ink-mute text-lg max-w-prose leading-relaxed">
          {template.short_pitch}
        </p>
      </div>

      <div className="prose-content text-ink-soft text-base leading-relaxed max-w-prose whitespace-pre-line">
        {template.description_md}
      </div>

      <div>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper rounded-md hover:bg-ink-soft transition-colors text-sm"
        >
          Build it with me <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}

// ─── Step 2: context check ──────────────────────────────────────────────────
function ContextCheck({
  refinement,
  setRefinement,
  onBack,
  onNext,
}: {
  refinement: string;
  setRefinement: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="flex flex-col gap-6 animate-fade-up max-w-2xl">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-widest text-ink-faint">
          Step 2 — Make it yours
        </span>
        <h2 className="font-display text-3xl text-ink tracking-tight">
          Anything we should know before we build?
        </h2>
        <p className="text-ink-mute leading-relaxed">
          We already have your business profile. This is for anything
          template-specific — categories you want, tone guidance, edge cases.
          Optional. You can always edit later.
        </p>
      </div>

      <textarea
        value={refinement}
        onChange={(e) => setRefinement(e.target.value)}
        rows={5}
        placeholder="e.g. classify shipping issues as 'logistics' not 'shipping' — we use that label internally. Tone should be warm but never apologetic."
        className="w-full p-4 bg-paper-dim border border-paper-edge rounded-lg text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink-mute transition-colors resize-none"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper rounded-md hover:bg-ink-soft transition-colors text-sm"
        >
          Materialize the system <span aria-hidden>→</span>
        </button>
        <button
          onClick={onBack}
          className="text-sm text-ink-faint hover:text-ink-mute"
        >
          Back
        </button>
      </div>
    </section>
  );
}

// ─── Step 3: synthesis ──────────────────────────────────────────────────────
function Synthesis({ active }: { active: boolean }) {
  return (
    <section className="flex flex-col items-start gap-6 animate-fade-up">
      <span className="text-[11px] uppercase tracking-widest text-ink-faint">
        Step 3 — Materialize
      </span>
      <h2 className="font-display text-3xl text-ink tracking-tight">
        Building your system…
      </h2>
      <div className="flex flex-col gap-2 text-ink-mute font-mono text-xs">
        <Pulse>Reading your business profile</Pulse>
        <Pulse delay={400}>Mapping nodes</Pulse>
        <Pulse delay={900}>Adapting to your industry</Pulse>
        <Pulse delay={1500}>Wiring decisions</Pulse>
        {!active && <span className="text-ochre-deep">→ done</span>}
      </div>
    </section>
  );
}

function Pulse({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <span
      style={{ animationDelay: `${delay}ms` }}
      className="opacity-0 animate-fade-up"
    >
      <span className="text-ochre-deep mr-2">·</span>
      {children}
    </span>
  );
}

// ─── Step 4: review ─────────────────────────────────────────────────────────
function Review({
  graph,
  onBack,
  onActivate,
}: {
  graph: WorkflowGraph;
  onBack: () => void;
  onActivate: () => void;
}) {
  return (
    <section className="flex flex-col gap-8 animate-fade-up">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-widest text-ink-faint">
          Step 4 — Review
        </span>
        <h2 className="font-display text-3xl text-ink tracking-tight">
          Here's what will run.
        </h2>
        <p className="text-ink-mute max-w-prose leading-relaxed">
          Each step below is editable. Nothing runs until you activate it on the next screen.
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {graph.nodes.map((n, i) => (
          <li
            key={n.id}
            className="flex gap-4 p-4 border border-paper-edge bg-paper rounded-lg hover:border-ink-mute transition-colors group"
          >
            <span className="font-mono text-[11px] text-ink-faint pt-1 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-widest text-ochre-deep">
                  {kindLabel(n.kind)}
                </span>
              </div>
              <h3 className="text-ink font-medium leading-tight">{n.label}</h3>
              <p className="text-ink-mute text-sm mt-1 leading-relaxed">
                {n.description}
              </p>
            </div>
            <button
              type="button"
              className="text-xs text-ink-faint hover:text-ink-mute self-start opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Edit
            </button>
          </li>
        ))}
      </ol>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onActivate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper rounded-md hover:bg-ink-soft transition-colors text-sm"
        >
          Looks right — activate it <span aria-hidden>→</span>
        </button>
        <button
          onClick={onBack}
          className="text-sm text-ink-faint hover:text-ink-mute"
        >
          Refine instead
        </button>
      </div>
    </section>
  );
}

// ─── Step 5: activate ───────────────────────────────────────────────────────
function Activate({ template }: { template: WorkflowTemplate }) {
  return (
    <section className="flex flex-col gap-6 animate-fade-up max-w-2xl">
      <span className="text-[11px] uppercase tracking-widest text-ochre-deep">
        Activated
      </span>
      <h2 className="font-display text-4xl text-ink tracking-tight leading-[1.05]">
        {template.name} is live.
      </h2>
      <p className="text-ink-mute text-lg leading-relaxed">
        It'll run automatically when its trigger fires. You can pause, edit, or
        run it manually from your dashboard. Nothing auto-sends — you stay in
        the loop.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper rounded-md hover:bg-ink-soft transition-colors text-sm"
        >
          Back to dashboard <span aria-hidden>→</span>
        </a>
        <a
          href="/build"
          className="text-sm text-ink-mute hover:text-ink"
        >
          Build another
        </a>
      </div>
    </section>
  );
}

function kindLabel(k: WorkflowGraph["nodes"][number]["kind"]) {
  switch (k) {
    case "trigger":
      return "Trigger";
    case "ai-step":
      return "AI step";
    case "tool-call":
      return "Tool";
    case "decision":
      return "Decision";
    case "output":
      return "Output";
  }
}
