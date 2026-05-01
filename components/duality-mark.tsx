// components/duality-mark.tsx
//
// The brand glyph. Two halves meeting along a curve — yin/yang abstracted.
// Used as the navigation indicator (which side of the duality am I on?),
// the loading state, and the favicon source.

import { cn } from "@/lib/utils";

interface Props {
  /** Which side is "lit" — controls the active emphasis. */
  state?: "balanced" | "learning" | "doing";
  size?: number;
  className?: string;
}

export function DualityMark({ state = "balanced", size = 24, className }: Props) {
  const learnFill = state === "doing" ? "currentColor" : "var(--ink)";
  const doFill = state === "learning" ? "currentColor" : "var(--ink)";
  const learnOpacity = state === "doing" ? 0.18 : 1;
  const doOpacity = state === "learning" ? 0.18 : 1;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn("inline-block", className)}
      aria-hidden
    >
      {/* Left half — "learning" / human side */}
      <path
        d="M16 2 a14 14 0 0 0 0 28 a7 7 0 0 1 0 -14 a7 7 0 0 0 0 -14z"
        fill={learnFill}
        opacity={learnOpacity}
      />
      {/* Right half — "doing" / machine side, drawn as outline */}
      <path
        d="M16 2 a14 14 0 0 1 0 28 a7 7 0 0 0 0 -14 a7 7 0 0 1 0 -14z"
        fill="none"
        stroke={doFill}
        strokeWidth="1.25"
        opacity={doOpacity}
      />
    </svg>
  );
}
