// app/(app)/layout.tsx
//
// Shell for every authed page: sidebar + main column. Calm, persistent.
// Kept deliberately bare — the sidebar is for navigation, not for noise.

import Link from "next/link";
import { DualityMark } from "@/components/duality-mark";

const NAV: { href: string; label: string; side: "yin" | "yang" }[] = [
  { href: "/dashboard", label: "Dashboard", side: "yin" },
  { href: "/learn", label: "Learn", side: "yin" },
  { href: "/build", label: "Build", side: "yang" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-56 xl:w-64 border-r border-paper-edge bg-paper-dim flex-col px-5 py-6 sticky top-0 self-start h-screen">
        <Link href="/dashboard" className="flex items-center gap-2.5 mb-12">
          <DualityMark size={20} />
          <span className="font-display text-base tracking-tight text-ink">
            yinandyang
            <span className="text-ink-faint">.ai</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-ink-mute hover:text-ink hover:bg-paper transition-colors"
            >
              <span
                className={`w-1 h-1 rounded-full ${
                  item.side === "yin" ? "bg-ochre" : "bg-steel"
                } opacity-50 group-hover:opacity-100`}
              />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-paper-edge">
          <Link
            href="/settings"
            className="text-xs text-ink-faint hover:text-ink-mute"
          >
            Settings
          </Link>
          <div className="text-[10px] text-ink-faint font-mono tracking-widest">
            v0.1 · MVP
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-paper-edge bg-paper-dim">
          <Link href="/dashboard" className="flex items-center gap-2">
            <DualityMark size={18} />
            <span className="font-display text-sm">yinandyang.ai</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-ink-mute">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-ink">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {children}
      </main>
    </div>
  );
}
