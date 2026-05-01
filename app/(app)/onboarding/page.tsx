"use client";

// app/(app)/onboarding/page.tsx
//
// The 5-question capture that powers Business-Aware AI. Designed to be
// completable in under 2 minutes. Every field maps directly to the
// `businesses` row.
//
// In Phase 1 (when Supabase is wired) the submit handler should write
// to the DB. For now it stores in localStorage so the rest of the app
// can read a profile without auth.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    field: "name" as const,
    eyebrow: "01 of 05",
    title: "What's your business called?",
    placeholder: "e.g. Akumi Clothing",
    type: "text" as const,
  },
  {
    field: "industry" as const,
    eyebrow: "02 of 05",
    title: "What kind of business?",
    placeholder: "Pick the closest fit",
    type: "options" as const,
    options: [
      { value: "ecommerce", label: "E-commerce / D2C" },
      { value: "agency", label: "Agency / services firm" },
      { value: "saas", label: "SaaS / software" },
      { value: "creator", label: "Creator / media" },
      { value: "services", label: "Local / professional services" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    field: "primary_goal" as const,
    eyebrow: "03 of 05",
    title: "What do you want AI to help with first?",
    placeholder:
      "e.g. handle our customer support emails so we stop missing replies",
    type: "textarea" as const,
  },
  {
    field: "current_tools" as const,
    eyebrow: "04 of 05",
    title: "What tools do you already use?",
    placeholder: "Comma-separate them — Shopify, Klaviyo, Notion…",
    type: "text" as const,
  },
  {
    field: "constraints" as const,
    eyebrow: "05 of 05",
    title: "Anything else we should know?",
    placeholder:
      "Optional. Voice notes, things to avoid, audience specifics — whatever helps.",
    type: "textarea" as const,
  },
];

type Profile = {
  name: string;
  industry: string;
  primary_goal: string;
  current_tools: string;
  constraints: string;
};

const EMPTY: Profile = {
  name: "",
  industry: "",
  primary_goal: "",
  current_tools: "",
  constraints: "",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const current = STEPS[step];
  const value = profile[current.field];
  const last = step === STEPS.length - 1;

  function next() {
    if (last) {
      // Phase 0: persist to localStorage so the rest of the app can read it.
      // Phase 1: replace this with a Supabase insert.
      const persisted = {
        ...profile,
        current_tools: profile.current_tools
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      try {
        localStorage.setItem("yyy.business", JSON.stringify(persisted));
      } catch {
        /* no-op */
      }
      router.push("/dashboard");
      return;
    }
    setStep((s) => s + 1);
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 sm:px-10 py-6 flex items-center justify-between">
        <Link href="/" className="font-display text-base tracking-tight text-ink">
          yinandyang<span className="text-ink-faint">.ai</span>
        </Link>
        <div className="text-xs font-mono text-ink-faint tracking-widest tabular-nums">
          {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </div>
      </header>

      {/* Progress rule */}
      <div className="h-[2px] bg-paper-edge relative">
        <div
          className="absolute left-0 top-0 h-full bg-ink"
          style={{
            width: `${((step + 1) / STEPS.length) * 100}%`,
            transition: "width 400ms cubic-bezier(0.2, 0.7, 0.2, 1)",
          }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div
          key={step}
          className="w-full max-w-2xl flex flex-col gap-8 animate-fade-up"
        >
          <span className="eyebrow">{current.eyebrow}</span>
          <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight leading-[1.05]">
            {current.title}
          </h1>

          {current.type === "text" && (
            <input
              autoFocus
              type="text"
              value={value}
              onChange={(e) =>
                setProfile((p) => ({ ...p, [current.field]: e.target.value }))
              }
              placeholder={current.placeholder}
              className="w-full bg-transparent border-b border-paper-edge focus:border-ink py-3 text-2xl font-display text-ink placeholder:text-ink-faint outline-none transition-colors"
            />
          )}

          {current.type === "textarea" && (
            <textarea
              autoFocus
              rows={3}
              value={value}
              onChange={(e) =>
                setProfile((p) => ({ ...p, [current.field]: e.target.value }))
              }
              placeholder={current.placeholder}
              className="w-full bg-transparent border-b border-paper-edge focus:border-ink py-3 text-xl text-ink placeholder:text-ink-faint outline-none transition-colors resize-none"
            />
          )}

          {current.type === "options" && (
            <div className="grid sm:grid-cols-2 gap-3">
              {current.options.map((opt) => {
                const selected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setProfile((p) => ({ ...p, [current.field]: opt.value }))
                    }
                    className={[
                      "text-left px-5 py-4 rounded-lg border transition-all",
                      selected
                        ? "border-ink bg-ink text-paper"
                        : "border-paper-edge bg-paper text-ink-soft hover:border-ink-mute",
                    ].join(" ")}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-6">
            <button
              onClick={back}
              disabled={step === 0}
              className="text-sm text-ink-faint hover:text-ink-mute disabled:opacity-0 transition-opacity"
            >
              ← Back
            </button>
            <button
              onClick={next}
              disabled={!value || (typeof value === "string" && value.trim().length === 0)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper rounded-md hover:bg-ink-soft transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {last ? "Take me to my dashboard" : "Continue"}
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
