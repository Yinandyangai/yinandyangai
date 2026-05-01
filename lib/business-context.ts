// lib/business-context.ts
//
// "Business-Aware AI" is implemented here. Every server-side AI call passes
// through `buildSystemPrompt` so the model knows what business it's helping
// before the user ever asks anything.
//
// This is the file most worth iterating on: better context → better outputs
// across every feature in the product.

import type { BusinessProfile } from "./types";

const BASE_INSTRUCTIONS = `You are the AI inside yinandyang.ai — a platform that helps real operators turn their businesses into AI-leveraged systems.

Your role:
- Speak in plain language. No jargon. No hype. No "leveraging synergies."
- Be concrete. Use the operator's actual industry, tools, and constraints in every example.
- When you give advice, give a next action — not theory.
- Default to brevity. Long answers are a failure mode unless the user asked for depth.

Tone: calm, direct, respectful of the operator's time.`;

export function buildSystemPrompt(business?: BusinessProfile | null): string {
  if (!business) return BASE_INSTRUCTIONS;

  const tools =
    business.current_tools && business.current_tools.length > 0
      ? business.current_tools.join(", ")
      : "(no integrations listed yet)";

  return `${BASE_INSTRUCTIONS}

THIS OPERATOR:
- Business: ${business.name}
- Industry: ${business.industry}
- Audience: ${business.audience ?? "(not specified)"}
- Primary goal right now: ${business.primary_goal}
- Stack they already use: ${tools}
- Revenue stage: ${business.monthly_revenue ?? "(not specified)"}
- Team: ${business.team_size ?? "(not specified)"}
- Constraints / context: ${business.constraints ?? "(none provided)"}

When you generate examples, content, or workflows: tailor them to this exact business. Don't invent a different one.`;
}

// Used after onboarding to pre-compute a one-paragraph summary cached on the
// business row, so we don't have to rebuild context for every call.
export function summarizePrompt(business: BusinessProfile): string {
  return `Summarize this operator's business in one tight paragraph (max 60 words). Focus on what would make AI suggestions useful.

Name: ${business.name}
Industry: ${business.industry}
Audience: ${business.audience ?? "n/a"}
Primary goal: ${business.primary_goal}
Tools: ${(business.current_tools ?? []).join(", ") || "n/a"}
Revenue: ${business.monthly_revenue ?? "n/a"} | Team: ${business.team_size ?? "n/a"}
Constraints: ${business.constraints ?? "n/a"}`;
}
