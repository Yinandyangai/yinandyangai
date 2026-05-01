// components/next-action-card.tsx
//
// The "what should I do next" card. The Continuous Evolution Engine writes
// recommendations; this component renders the top one. There is always one.
// Empty state is unacceptable — it's what makes the dashboard never feel dead.

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/lib/types";

interface Props {
  recommendation: Recommendation | null;
  className?: string;
}

export function NextActionCard({ recommendation, className }: Props) {
  // Always-present fallback so the card is never empty.
  const r: Recommendation = recommendation ?? {
    id: "fallback",
    business_id: "",
    kind: "next_lesson",
    title: "Find your first AI-fit task",
    rationale:
      "Five-minute audit of your week. We'll pick the highest-leverage thing to automate first.",
    cta_label: "Start the audit",
    cta_target: "/learn/find-your-first-ai-fit-task",
    priority: 100,
    dismissed: false,
    acted_on: false,
    created_at: new Date().toISOString(),
  };

  return (
    <div
      className={cn(
        "relative flex flex-col gap-5 p-6 sm:p-7 border border-paper-edge bg-paper rounded-xl",
        "before:absolute before:left-0 before:top-6 before:bottom-6 before:w-[2px] before:bg-ochre",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-[11px] uppercase tracking-widest text-ochre-deep">
          Next action
        </span>
        <span className="text-[11px] text-ink-faint">
          {kindLabel(r.kind)}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-2xl text-ink leading-tight tracking-tight">
          {r.title}
        </h3>
        <p className="text-ink-mute text-sm leading-relaxed max-w-prose">
          {r.rationale}
        </p>
      </div>

      <div className="flex items-center gap-3 mt-1">
        <Link
          href={r.cta_target}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-ink text-paper rounded-md hover:bg-ink-soft transition-colors"
        >
          {r.cta_label}
          <span aria-hidden>→</span>
        </Link>
        {recommendation && (
          <button
            type="button"
            className="text-xs text-ink-faint hover:text-ink-mute transition-colors"
          >
            Not now
          </button>
        )}
      </div>
    </div>
  );
}

function kindLabel(k: Recommendation["kind"]) {
  switch (k) {
    case "new_workflow":
      return "Build a new system";
    case "optimize_workflow":
      return "Optimize what's running";
    case "next_lesson":
      return "Concept first";
  }
}
