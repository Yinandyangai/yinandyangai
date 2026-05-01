// app/(app)/learn/[slug]/page.tsx
//
// One lesson. Reads body_md and renders it with a tiny purpose-built
// markdown converter (we don't pull in a parser dep at this stage — these
// lessons use a constrained subset: paragraphs, ** **, lists, headings).
//
// The "Apply to my business" CTA is the bridge from Clarity to Execution.
// Clicking it sends the operator into /build with the lesson's action_prompt
// pre-loaded as the framing.

import Link from "next/link";
import { notFound } from "next/navigation";
import { SEED_LESSONS } from "@/lib/seed/lessons";

interface Props {
  params: { slug: string };
}

export default function LessonPage({ params }: Props) {
  const lesson = SEED_LESSONS.find((l) => l.slug === params.slug);
  if (!lesson) notFound();

  // Sibling lessons in the same track for the prev/next nav.
  const trackLessons = SEED_LESSONS.filter((l) => l.track === lesson.track).sort(
    (a, b) => a.position - b.position,
  );
  const idx = trackLessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? trackLessons[idx - 1] : null;
  const next = idx >= 0 && idx < trackLessons.length - 1 ? trackLessons[idx + 1] : null;

  return (
    <div className="px-6 lg:px-12 py-10 lg:py-14 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/learn"
        className="inline-block text-xs text-ink-faint hover:text-ink-mute mb-8 font-mono"
      >
        ← Library
      </Link>

      {/* Header */}
      <header className="mb-10 animate-fade-up">
        <p className="eyebrow text-ink-faint mb-3">
          {trackLabel(lesson.track)} ·{" "}
          <span className="text-ink-mute">
            Lesson {String(lesson.position).padStart(2, "0")}
          </span>{" "}
          · {lesson.duration_min} min
        </p>
        <h1 className="font-display text-3xl lg:text-4xl text-ink tracking-tight leading-tight mb-4">
          {lesson.title}
        </h1>
        <p className="text-lg text-ink-mute leading-relaxed">{lesson.summary}</p>
      </header>

      {/* Body */}
      <article className="prose-lesson animate-fade-up" style={{ animationDelay: "60ms" }}>
        <Markdown source={lesson.body_md} />
      </article>

      {/* Apply CTA */}
      {lesson.action_prompt && (
        <div
          className="mt-12 border border-ochre/30 bg-ochre/[0.04] rounded-lg p-6 animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <p className="eyebrow text-ochre mb-3">Apply to your business</p>
          <p className="text-ink leading-relaxed mb-5">{lesson.action_prompt}</p>
          <Link
            href={`/build?from=${lesson.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-paper bg-ink px-4 py-2 rounded-md hover:bg-ink/90 transition-colors"
          >
            Build it now
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}

      {/* Prev/Next */}
      <nav className="mt-16 pt-8 border-t border-paper-edge flex items-stretch gap-4 text-sm">
        <div className="flex-1">
          {prev ? (
            <Link
              href={`/learn/${prev.slug}`}
              className="block group border border-paper-edge rounded-md p-4 hover:bg-paper-dim transition-colors h-full"
            >
              <span className="text-xs text-ink-faint font-mono">← Previous</span>
              <span className="block mt-1 font-display text-ink group-hover:text-ochre transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="h-full" />
          )}
        </div>
        <div className="flex-1">
          {next ? (
            <Link
              href={`/learn/${next.slug}`}
              className="block group border border-paper-edge rounded-md p-4 hover:bg-paper-dim transition-colors h-full text-right"
            >
              <span className="text-xs text-ink-faint font-mono">Next →</span>
              <span className="block mt-1 font-display text-ink group-hover:text-ochre transition-colors">
                {next.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/learn"
              className="block border border-paper-edge rounded-md p-4 hover:bg-paper-dim transition-colors h-full text-right"
            >
              <span className="text-xs text-ink-faint font-mono">↑ Library</span>
              <span className="block mt-1 font-display text-ink">
                Choose another lesson
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function trackLabel(t: string) {
  const map: Record<string, string> = {
    fundamentals: "Fundamentals",
    "customer-ops": "Customer Ops",
    sales: "Sales",
    content: "Content",
  };
  return map[t] ?? t;
}

// ─── Tiny markdown renderer ───────────────────────────────────────────────────
// Supports paragraphs, **bold**, unordered lists, headings (## , ### ).
// Intentionally constrained — keeps lesson authoring legible in TS source
// and avoids a runtime markdown dep for the MVP.
function Markdown({ source }: { source: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = source.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    // Heading
    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="font-display text-lg text-ink mt-8 mb-3">
          {line.slice(4)}
        </h3>,
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} className="font-display text-xl text-ink mt-10 mb-3">
          {line.slice(3)}
        </h2>,
      );
      i++;
      continue;
    }

    // Unordered list
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc pl-5 space-y-1.5 my-4 text-ink-mute">
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Paragraph (gather until blank line)
    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !isBlockStart(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p
        key={key++}
        className="text-ink-mute leading-relaxed my-4"
      >
        {inline(para.join(" "))}
      </p>,
    );
  }

  return <>{blocks}</>;
}

function isBlockStart(line: string) {
  return line.startsWith("- ") || line.startsWith("## ") || line.startsWith("### ");
}

// Inline ** ** -> <strong>. Splits on `**` markers.
function inline(text: string): React.ReactNode {
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
