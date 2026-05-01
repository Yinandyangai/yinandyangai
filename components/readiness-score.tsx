// components/readiness-score.tsx
//
// The most prominent number on the dashboard. It's the operator's "how
// AI-leveraged is my business" score, 0-100. Backed by v_readiness_score.

import { cn } from "@/lib/utils";
import type { ReadinessScore as Score } from "@/lib/types";

interface Props {
  score: Score | null;
  className?: string;
}

const TIERS = [
  { min: 0, label: "Just getting started", tone: "ink-mute" },
  { min: 25, label: "Wiring it up", tone: "ink-soft" },
  { min: 50, label: "Operating with leverage", tone: "ochre-deep" },
  { min: 75, label: "AI-native", tone: "ochre" },
];

export function ReadinessScore({ score, className }: Props) {
  const total = score?.total_score ?? 0;
  const tier = [...TIERS].reverse().find((t) => total >= t.min)!;
  const breakdown = [
    { label: "Breadth", v: score?.breadth_score ?? 0, max: 40 },
    { label: "Depth", v: score?.depth_score ?? 0, max: 30 },
    { label: "Learning", v: score?.learning_score ?? 0, max: 20 },
    { label: "Integrations", v: score?.integration_score ?? 0, max: 10 },
  ];

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-baseline gap-4">
        <div className="font-display text-7xl text-ink leading-none tracking-tightest tabular-nums">
          {total}
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-ink-faint">
            AI Readiness
          </span>
          <span className="text-sm text-ink-mute">{tier.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {breakdown.map((b) => (
          <Bar key={b.label} {...b} />
        ))}
      </div>
    </div>
  );
}

function Bar({ label, v, max }: { label: string; v: number; max: number }) {
  const pct = Math.round((v / max) * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-1 bg-paper-edge rounded-full overflow-hidden">
        <div
          className="h-full bg-ink"
          style={{ width: `${pct}%`, transition: "width 600ms ease" }}
        />
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] text-ink-faint">{label}</span>
        <span className="text-[11px] text-ink-mute tabular-nums">
          {v}/{max}
        </span>
      </div>
    </div>
  );
}
