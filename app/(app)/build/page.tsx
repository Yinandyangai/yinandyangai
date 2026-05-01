// app/(app)/build/page.tsx
//
// The Creation Layer entry: a gallery of workflow archetypes the operator
// can spin up. Each card shows what it does, who it's for (tier), and
// drops the operator into the Build-With-Me sequence on click.
//
// Reads from SEED_TEMPLATES in Phase 0; will read from `workflow_templates`
// in Phase 1 with the same interface.

import Link from "next/link";
import { SEED_TEMPLATES } from "@/lib/seed/templates";
import type { WorkflowTemplate, Tier } from "@/lib/types";

const CATEGORY_ORDER = [
  "customer-support",
  "sales",
  "content",
  "operations",
  "internal",
];

export default function BuildPage() {
  const grouped = groupByCategory(SEED_TEMPLATES);

  return (
    <div className="px-6 lg:px-12 py-10 lg:py-14 max-w-6xl mx-auto">
      <header className="mb-14 animate-fade-up max-w-2xl">
        <p className="eyebrow text-ink-faint mb-2">Creation layer</p>
        <h1 className="font-display text-3xl lg:text-4xl text-ink tracking-tight mb-4">
          Pick an archetype. Make it yours.
        </h1>
        <p className="text-ink-mute leading-relaxed">
          Every template here is a battle-tested shape. Tell us about your
          business in plain English; we&rsquo;ll synthesize the workflow,
          show you the graph, and let you tweak before activating.
        </p>
      </header>

      <div className="space-y-14">
        {CATEGORY_ORDER.filter((c) => grouped[c]?.length).map((cat, i) => (
          <section
            key={cat}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-display text-xl lg:text-2xl text-ink tracking-tight">
                {categoryLabel(cat)}
              </h2>
              <span className="text-xs font-mono text-ink-faint">
                {grouped[cat].length} archetype
                {grouped[cat].length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {grouped[cat].map((tmpl) => (
                <TemplateCard key={tmpl.id} template={tmpl} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// ─── Template card ────────────────────────────────────────────────────────────
function TemplateCard({ template }: { template: WorkflowTemplate }) {
  return (
    <Link
      href={`/build/${template.slug}`}
      className="group block border border-paper-edge rounded-lg p-5 bg-paper hover:bg-paper-dim hover:border-ink/20 transition-colors h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10px] uppercase tracking-widest font-mono text-ink-faint">
          {template.archetype}
        </span>
        <TierBadge tier={template.required_tier} />
      </div>
      <h3 className="font-display text-xl text-ink leading-snug mb-2 group-hover:text-ochre transition-colors">
        {template.name}
      </h3>
      <p className="text-sm text-ink-mute leading-relaxed mb-5">
        {template.short_pitch}
      </p>
      <div className="flex items-center gap-2 text-xs text-ink-mute">
        <span className="text-ochre">→</span>
        <span>{nodeCount(template)} steps · synthesized to your business</span>
      </div>
    </Link>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  if (tier === "free") {
    return (
      <span className="text-[10px] uppercase tracking-widest font-mono text-ink-faint">
        Free
      </span>
    );
  }
  const label = tier === "pro" ? "Pro" : "Operator";
  return (
    <span className="text-[10px] uppercase tracking-widest font-mono text-ochre border border-ochre/30 rounded-full px-2 py-0.5">
      {label}
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    "customer-support": "Customer Support",
    sales: "Sales",
    content: "Content",
    operations: "Operations",
    internal: "Internal Ops",
  };
  return map[cat] ?? cat;
}

function nodeCount(t: WorkflowTemplate): number {
  return t.default_graph?.nodes?.length ?? 0;
}

function groupByCategory(templates: WorkflowTemplate[]): Record<string, WorkflowTemplate[]> {
  const out: Record<string, WorkflowTemplate[]> = {};
  for (const t of templates) {
    (out[t.category] ??= []).push(t);
  }
  return out;
}
