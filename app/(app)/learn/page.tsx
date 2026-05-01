// app/(app)/learn/page.tsx
//
// The Learning Engine entry. Reads from SEED_LESSONS in Phase 0; will read
// from the `lessons` table in Phase 1 with no shape change.
//
// Editorial layout: tracks as columns of cards. Each card shows position,
// duration, summary, tier badge. No video thumbnails. No progress bars yet
// (those land when lesson_progress is wired).

import Link from "next/link";
import { SEED_LESSONS } from "@/lib/seed/lessons";
import type { Lesson, LessonTrack, Tier } from "@/lib/types";

const TRACKS: { key: LessonTrack; label: string; tagline: string }[] = [
  {
    key: "fundamentals",
    label: "Fundamentals",
    tagline: "What AI is, what it isn't, and where to start.",
  },
  {
    key: "customer-ops",
    label: "Customer Ops",
    tagline: "Triage, support, and retention — automated.",
  },
  {
    key: "sales",
    label: "Sales",
    tagline: "Lead capture, qualification, and follow-through.",
  },
  {
    key: "content",
    label: "Content",
    tagline: "From one idea to a week of distribution.",
  },
];

export default function LearnPage() {
  const byTrack = groupByTrack(SEED_LESSONS);

  return (
    <div className="px-6 lg:px-12 py-10 lg:py-14 max-w-6xl mx-auto">
      <header className="mb-14 animate-fade-up max-w-2xl">
        <p className="eyebrow text-ink-faint mb-2">Clarity layer</p>
        <h1 className="font-display text-3xl lg:text-4xl text-ink tracking-tight mb-4">
          Learn AI, the way an operator needs it.
        </h1>
        <p className="text-ink-mute leading-relaxed">
          Short. Specific. Every lesson ends with a thing you can do today —
          inside your business, not in a sandbox.
        </p>
      </header>

      <div className="space-y-16">
        {TRACKS.map((track, i) => (
          <section
            key={track.key}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="mb-6 flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-display text-xl lg:text-2xl text-ink tracking-tight">
                  {track.label}
                </h2>
                <p className="text-sm text-ink-mute mt-1">{track.tagline}</p>
              </div>
              <span className="text-xs font-mono text-ink-faint">
                {(byTrack[track.key] ?? []).length} lesson
                {(byTrack[track.key] ?? []).length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {(byTrack[track.key] ?? []).map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
              {(!byTrack[track.key] || byTrack[track.key]!.length === 0) && (
                <div className="md:col-span-2 border border-dashed border-paper-edge rounded-lg p-6 text-sm text-ink-faint">
                  More lessons in this track are landing soon.
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// ─── Lesson card ──────────────────────────────────────────────────────────────
function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className="group block border border-paper-edge rounded-lg p-5 bg-paper hover:bg-paper-dim transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-ink-faint">
          {String(lesson.position).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          <TierBadge tier={lesson.required_tier} />
          <span className="text-xs text-ink-faint">
            {lesson.duration_min} min
          </span>
        </div>
      </div>
      <h3 className="font-display text-lg text-ink leading-snug mb-2 group-hover:text-ochre transition-colors">
        {lesson.title}
      </h3>
      <p className="text-sm text-ink-mute leading-relaxed line-clamp-3">
        {lesson.summary}
      </p>
    </Link>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  if (tier === "free") return null;
  const label = tier === "pro" ? "Pro" : "Operator";
  return (
    <span className="text-[10px] uppercase tracking-widest font-mono text-ochre border border-ochre/30 rounded-full px-2 py-0.5">
      {label}
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function groupByTrack(lessons: Lesson[]): Record<LessonTrack, Lesson[]> {
  const out: Record<string, Lesson[]> = {};
  for (const l of lessons) {
    (out[l.track] ??= []).push(l);
  }
  for (const k of Object.keys(out)) {
    out[k].sort((a, b) => a.position - b.position);
  }
  return out as Record<LessonTrack, Lesson[]>;
}
