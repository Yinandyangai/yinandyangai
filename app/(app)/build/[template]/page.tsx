// app/(app)/build/[template]/page.tsx
//
// The Build-With-Me workspace for a single template. Server component that
// looks up the template by slug, then renders the client BuildWithMe
// state machine. Description and a small "what this builds" preview
// frame the experience before synthesis.

import Link from "next/link";
import { notFound } from "next/navigation";
import { SEED_TEMPLATES } from "@/lib/seed/templates";
import { BuildWithMe } from "@/components/build-with-me";

interface Props {
  params: { template: string };
}

export default function BuildTemplatePage({ params }: Props) {
  const template = SEED_TEMPLATES.find((t) => t.slug === params.template);
  if (!template) notFound();

  return (
    <div className="px-6 lg:px-12 py-10 lg:py-14 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/build"
        className="inline-block text-xs text-ink-faint hover:text-ink-mute mb-8 font-mono"
      >
        ← Archetypes
      </Link>

      {/* Header */}
      <header className="mb-10 animate-fade-up max-w-2xl">
        <p className="eyebrow text-ink-faint mb-3">{template.archetype}</p>
        <h1 className="font-display text-3xl lg:text-4xl text-ink tracking-tight leading-tight mb-4">
          {template.name}
        </h1>
        <p className="text-lg text-ink-mute leading-relaxed">
          {template.short_pitch}
        </p>
      </header>

      {/* Description */}
      <section
        className="mb-12 border-l-2 border-ochre/40 pl-5 max-w-2xl animate-fade-up"
        style={{ animationDelay: "60ms" }}
      >
        <DescriptionBlock markdown={template.description_md} />
      </section>

      {/* Build-With-Me workspace */}
      <section className="animate-fade-up" style={{ animationDelay: "120ms" }}>
        <BuildWithMe template={template} />
      </section>
    </div>
  );
}

// Lightweight description renderer — reuses the constrained-markdown idea
// from the lesson page. Kept inline here to avoid a shared dep for now.
function DescriptionBlock({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul
          key={key++}
          className="list-disc pl-5 space-y-1.5 my-3 text-ink-mute text-sm"
        >
          {items.map((it, j) => (
            <li key={j}>{inlineFormat(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("- ")) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key++} className="text-ink-mute leading-relaxed text-sm my-3">
        {inlineFormat(para.join(" "))}
      </p>,
    );
  }

  return <>{blocks}</>;
}

function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="text-ink font-semibold">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
