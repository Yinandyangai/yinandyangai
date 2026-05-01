// app/(app)/dashboard/page.tsx
//
// Mission control. The single screen that answers "what should I do next?"
// at every visit — that's the whole UX promise of the dashboard.
//
// Composition (top to bottom):
//   1. Greeting + Readiness Score (the headline number)
//   2. Next Action card (always present — never a dead end)
//   3. Active workflows list (or empty state pointing at /build)
//   4. Recent runs (or empty state pointing at activation)
//
// In Phase 0 this reads from localStorage / seed data; in Phase 1 it reads
// from Supabase. The component contracts don't change between the two.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ReadinessScore } from "@/components/readiness-score";
import { NextActionCard } from "@/components/next-action-card";
import { DualityMark } from "@/components/duality-mark";
import type { ReadinessScore as Score, BusinessProfile } from "@/lib/types";

// Phase 0: Stub a starting score. Once we wire the v_readiness_score view,
// this whole block goes away.
const STARTING_SCORE: Score = {
  business_id: "local",
  breadth_score: 0,
  depth_score: 0,
  learning_score: 0,
  integration_score: 0,
  total_score: 0,
};

export default function DashboardPage() {
  const [business, setBusiness] = useState<Partial<BusinessProfile> | null>(null);
  const [score] = useState<Score>(STARTING_SCORE);

  useEffect(() => {
    // Phase 0 onboarding writes to localStorage. Read it here.
    try {
      const raw = localStorage.getItem("yinandyang.business");
      if (raw) setBusiness(JSON.parse(raw));
    } catch {
      // Fine — first-time visitor.
    }
  }, []);

  const greeting = greet();
  const name = business?.name?.trim();

  return (
    <div className="px-6 lg:px-12 py-10 lg:py-14 max-w-5xl mx-auto">
      {/* Greeting */}
      <header className="mb-12 animate-fade-up">
        <p className="eyebrow text-ink-faint mb-2">{greeting}</p>
        <h1 className="font-display text-3xl lg:text-4xl text-ink tracking-tight">
          {name ? (
            <>
              Welcome back, <span className="text-ochre">{name}</span>.
            </>
          ) : (
            <>Mission control.</>
          )}
        </h1>
        <p className="mt-3 text-ink-mute max-w-xl">
          One screen. One next move. Every visit.
        </p>
      </header>

      {/* Readiness Score */}
      <section className="mb-12 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <ReadinessScore score={score} />
      </section>

      {/* Next Action — the never-empty card */}
      <section
        className="mb-14 animate-fade-up"
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="eyebrow text-ink-faint mb-4">Your next move</h2>
        <NextActionCard recommendation={null} />
      </section>

      {/* Active workflows */}
      <section className="mb-14 animate-fade-up" style={{ animationDelay: "180ms" }}>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="eyebrow text-ink-faint">Active workflows</h2>
          <Link
            href="/build"
            className="text-xs text-ink-mute hover:text-ink underline-offset-4 hover:underline"
          >
            Build a new one →
          </Link>
        </div>
        <EmptyWorkflows />
      </section>

      {/* Recent runs */}
      <section className="animate-fade-up" style={{ animationDelay: "240ms" }}>
        <h2 className="eyebrow text-ink-faint mb-5">Recent activity</h2>
        <div className="border border-paper-edge rounded-lg p-8 bg-paper-dim text-center">
          <p className="text-sm text-ink-mute">
            No runs yet. Activate a workflow and the log fills here.
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── Greeting helper ──────────────────────────────────────────────────────────
function greet() {
  const h = new Date().getHours();
  if (h < 5) return "Late night.";
  if (h < 12) return "This morning.";
  if (h < 17) return "This afternoon.";
  if (h < 21) return "This evening.";
  return "Tonight.";
}

// ─── Empty state for workflows ────────────────────────────────────────────────
function EmptyWorkflows() {
  return (
    <div className="border border-paper-edge rounded-lg p-8 bg-paper-dim">
      <div className="flex items-start gap-5">
        <div className="shrink-0 mt-1">
          <DualityMark state="balanced" size={36} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl text-ink mb-2">
            Nothing running yet.
          </h3>
          <p className="text-sm text-ink-mute mb-5 max-w-md">
            Pick a workflow archetype, describe what you want it to do, and
            we&rsquo;ll synthesize a draft you can review before activating.
          </p>
          <Link
            href="/build"
            className="inline-flex items-center gap-2 text-sm font-medium text-paper bg-ink px-4 py-2 rounded-md hover:bg-ink/90 transition-colors"
          >
            Browse archetypes
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
