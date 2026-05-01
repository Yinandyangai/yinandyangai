// app/page.tsx — the marketing landing
//
// Editorial minimalism. The whole page should feel like a serious magazine
// front matter, not a SaaS landing. The duality concept anchors everything.

import Link from "next/link";
import { DualityMark } from "@/components/duality-mark";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <DualityFold />
      <FourLayers />
      <SignatureFeatures />
      <Pricing />
      <FinalCta />
      <Footer />
    </main>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="max-w-screen mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5 group">
        <DualityMark size={22} />
        <span className="font-display text-lg tracking-tight text-ink">
          yinandyang
          <span className="text-ink-faint">.ai</span>
        </span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <a href="#layers" className="text-ink-mute hover:text-ink hidden sm:inline">
          The four layers
        </a>
        <a href="#pricing" className="text-ink-mute hover:text-ink hidden sm:inline">
          Pricing
        </a>
        <Link
          href="/onboarding"
          className="px-3.5 py-1.5 bg-ink text-paper rounded-md hover:bg-ink-soft transition-colors"
        >
          Start free
        </Link>
      </nav>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="max-w-screen mx-auto px-6 sm:px-10 pt-20 pb-32 sm:pt-32 sm:pb-44 grid lg:grid-cols-12 gap-10 items-end">
      <div className="lg:col-span-8 flex flex-col gap-8 animate-fade-up">
        <span className="eyebrow">Volume one — the operator's edition</span>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-[88px] leading-[0.98] tracking-tightest text-ink">
          Run an AI&#8209;native business
          <br />
          <span className="italic text-ink-soft">without the noise.</span>
        </h1>
        <p className="text-ink-mute text-lg sm:text-xl max-w-prose leading-relaxed">
          yinandyang.ai is the operating system for operators who are tired of theory.
          Learn what AI is actually good at, build the systems that move your numbers,
          and run them every day from one calm dashboard.
        </p>
        <div className="flex items-center gap-5 pt-2">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-paper rounded-md hover:bg-ink-soft transition-colors text-sm"
          >
            Start free <span aria-hidden>→</span>
          </Link>
          <a
            href="#layers"
            className="text-sm text-ink-mute hover:text-ink underline underline-offset-4"
          >
            See how it works
          </a>
        </div>
      </div>

      {/* Right column — large duality glyph as the hero image */}
      <div className="lg:col-span-4 flex justify-center lg:justify-end">
        <div className="relative w-56 h-56 sm:w-72 sm:h-72">
          <DualityMark size={288} className="absolute inset-0 text-ink" />
          <div className="absolute -bottom-1 right-0 text-[10px] font-mono text-ink-faint tracking-widest">
            est. {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Duality fold ────────────────────────────────────────────────────────────
function DualityFold() {
  return (
    <section className="border-y border-paper-edge bg-paper-dim">
      <div className="max-w-screen mx-auto px-6 sm:px-10 py-20 grid lg:grid-cols-2">
        <div className="flex flex-col gap-3 pr-8 lg:border-r border-paper-edge">
          <span className="eyebrow text-ochre-deep">Yin · the human side</span>
          <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight leading-tight">
            Strategy. Intuition. Learning.
          </h2>
          <p className="text-ink-mute leading-relaxed max-w-md">
            What AI is actually good at. Where it fits in your business. Why
            most prompts fail. The judgment calls only you can make.
          </p>
        </div>
        <div className="flex flex-col gap-3 pl-0 lg:pl-8 mt-10 lg:mt-0">
          <span className="eyebrow text-steel">Yang · the machine side</span>
          <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight leading-tight">
            Execution. Intelligence. Doing.
          </h2>
          <p className="text-ink-mute leading-relaxed max-w-md">
            Real workflows, running every day. Triage. Lead qualification.
            Content pipelines. Built once with you, then operating in the background.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Four layers ─────────────────────────────────────────────────────────────
const LAYERS = [
  {
    n: "01",
    title: "Learning Engine",
    sub: "Clarity layer",
    desc: "Interactive lessons in plain language. Concept → example → use case → action. No 90-minute videos. No theory dumps.",
  },
  {
    n: "02",
    title: "Implementation Engine",
    sub: "Execution layer",
    desc: "Step-by-step guided builds for the workflows that matter. The platform reads your business profile and adapts every instruction.",
  },
  {
    n: "03",
    title: "System Builder",
    sub: "Creation layer",
    desc: "Describe a system in plain English. Watch it materialize as a graph you can edit. Pre-built archetypes: Sales Rep, Ops Manager, Content Engine.",
  },
  {
    n: "04",
    title: "Operating System Dashboard",
    sub: "Integration layer",
    desc: "Mission control. Active systems, performance, AI Readiness Score, and the next thing worth building. One screen.",
  },
];

function FourLayers() {
  return (
    <section id="layers" className="max-w-screen mx-auto px-6 sm:px-10 py-28">
      <div className="flex flex-col gap-3 mb-14 max-w-2xl">
        <span className="eyebrow">The four layers</span>
        <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-tight leading-tight">
          Built to take you from <span className="italic">curious</span> to{" "}
          <span className="italic">operating</span>.
        </h2>
      </div>
      <ol className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
        {LAYERS.map((l) => (
          <li
            key={l.n}
            className="flex gap-6 pt-6 border-t border-paper-edge"
          >
            <span className="font-mono text-xs text-ochre-deep tabular-nums shrink-0 mt-1">
              {l.n}
            </span>
            <div className="flex-1">
              <span className="eyebrow text-ink-faint block mb-1">{l.sub}</span>
              <h3 className="font-display text-2xl text-ink tracking-tight mb-2">
                {l.title}
              </h3>
              <p className="text-ink-mute leading-relaxed max-w-md">{l.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ─── Signature features ─────────────────────────────────────────────────────
const FEATURES = [
  ["Build With Me", "Real-time guided execution. Describe a system; we materialize it together; you tweak it node-by-node before it runs."],
  ["Business-Aware AI", "Your industry, audience, tools, and constraints inform every lesson, every workflow, every recommendation."],
  ["Prompt-to-System", "Plain-English description in. Working AI workflow out. The lowest-friction path from idea to running system."],
  ["AI Readiness Score", "A single number, 0–100, for how AI-leveraged your business is. With the four levers that move it."],
  ["Continuous Evolution", "Every Monday: one ranked recommendation for what to build, optimize, or learn next. Based on your actual usage."],
];

function SignatureFeatures() {
  return (
    <section className="bg-paper-dim border-y border-paper-edge">
      <div className="max-w-screen mx-auto px-6 sm:px-10 py-24">
        <div className="flex flex-col gap-3 mb-12 max-w-2xl">
          <span className="eyebrow">Signature features</span>
          <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-tight leading-tight">
            The five things you'll feel first.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(([title, desc], i) => (
            <article
              key={title}
              className="p-6 bg-paper border border-paper-edge rounded-xl flex flex-col gap-3"
            >
              <span className="font-mono text-[10px] text-ink-faint tabular-nums tracking-widest">
                F.0{i + 1}
              </span>
              <h3 className="font-display text-xl text-ink tracking-tight">
                {title}
              </h3>
              <p className="text-ink-mute text-sm leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
const TIERS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    pitch: "Enough to find your first AI-fit task and build it.",
    features: [
      "3 lessons from the Fundamentals track",
      "1 active workflow",
      "Mock + low-cost models",
      "Readiness Score",
    ],
    cta: "Start free",
    href: "/onboarding",
    accent: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/ month",
    pitch: "Full library + the workflows most operators run.",
    features: [
      "Entire learning library",
      "5 active workflows",
      "AI usage included up to a fair cap",
      "Continuous Evolution recommendations",
    ],
    cta: "Start free, upgrade later",
    href: "/onboarding",
    accent: true,
  },
  {
    name: "Operator",
    price: "$99",
    cadence: "/ month",
    pitch: "For people whose business depends on it.",
    features: [
      "Unlimited workflows",
      "Integrations (Gmail, Slack, HubSpot, Notion)",
      "Priority models for synthesis",
      "Run analytics + cost dashboards",
    ],
    cta: "Talk to us",
    href: "/onboarding",
    accent: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="max-w-screen mx-auto px-6 sm:px-10 py-28">
      <div className="flex flex-col gap-3 mb-14 max-w-2xl">
        <span className="eyebrow">Pricing</span>
        <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-tight leading-tight">
          Free to start. Compounds with use.
        </h2>
        <p className="text-ink-mute mt-2">
          Done-with-you (a real human helps you build) starts at $499.
          Talk to us.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((t) => (
          <article
            key={t.name}
            className={[
              "flex flex-col gap-5 p-7 rounded-xl border",
              t.accent
                ? "bg-ink text-paper border-ink"
                : "bg-paper border-paper-edge",
            ].join(" ")}
          >
            <div>
              <span
                className={[
                  "eyebrow",
                  t.accent ? "text-ochre-glow" : "text-ochre-deep",
                ].join(" ")}
              >
                {t.name}
              </span>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="font-display text-5xl tracking-tightest">
                  {t.price}
                </span>
                <span
                  className={t.accent ? "text-paper-edge" : "text-ink-faint"}
                >
                  {t.cadence}
                </span>
              </div>
              <p
                className={[
                  "mt-3 text-sm leading-relaxed",
                  t.accent ? "text-paper-edge" : "text-ink-mute",
                ].join(" ")}
              >
                {t.pitch}
              </p>
            </div>
            <ul
              className={[
                "flex flex-col gap-2 text-sm",
                t.accent ? "text-paper" : "text-ink-soft",
              ].join(" ")}
            >
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span
                    className={t.accent ? "text-ochre-glow" : "text-ochre-deep"}
                  >
                    ·
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={t.href}
              className={[
                "mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm transition-colors w-fit",
                t.accent
                  ? "bg-paper text-ink hover:bg-paper-dim"
                  : "bg-ink text-paper hover:bg-ink-soft",
              ].join(" ")}
            >
              {t.cta} <span aria-hidden>→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── Final CTA ───────────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <section className="border-t border-paper-edge">
      <div className="max-w-screen mx-auto px-6 sm:px-10 py-24 flex flex-col items-start gap-8">
        <DualityMark size={64} />
        <h2 className="font-display text-5xl sm:text-6xl text-ink tracking-tight leading-[1.0] max-w-3xl">
          Stop reading about AI.
          <br />
          <span className="italic text-ink-soft">Run on it.</span>
        </h2>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-paper rounded-md hover:bg-ink-soft transition-colors text-sm"
        >
          Start free — 2 minutes <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-paper-edge">
      <div className="max-w-screen mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-ink-faint">
        <div className="flex items-center gap-2">
          <DualityMark size={16} />
          <span>yinandyang.ai · the operating system for AI-native businesses</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-ink-mute">Privacy</a>
          <a href="#" className="hover:text-ink-mute">Terms</a>
          <a href="#" className="hover:text-ink-mute">Contact</a>
        </div>
      </div>
    </footer>
  );
}
