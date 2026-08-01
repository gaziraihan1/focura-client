"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

/* ─── Mini dashboard mockup (pure CSS, mirrors real app structure) ───────── */

const MOCK_NAV = ["Dashboard", "Tasks", "Projects", "Calendar", "Wellness"];

function MiniDashboardMock() {
  const columns = [
    {
      name: "Planned",
      count: 2,
      color: "bg-foreground/40",
      tasks: [
        { title: "Design system audit", tag: "Design", tagColor: "bg-blue-500/10 text-blue-600" },
        { title: "API rate limiting", tag: "Backend", tagColor: "bg-purple-500/10 text-purple-600" },
      ],
    },
    {
      name: "In progress",
      count: 2,
      color: "bg-foreground",
      tasks: [
        { title: "Mobile nav refactor", tag: "Mobile", tagColor: "bg-emerald-500/10 text-emerald-600" },
        { title: "Onboarding flow v2", tag: "Product", tagColor: "bg-pink-500/10 text-pink-600" },
      ],
    },
    {
      name: "Done",
      count: 1,
      color: "bg-green-500",
      tasks: [{ title: "Search UX polish", tag: "UX", tagColor: "bg-cyan-500/10 text-cyan-600" }],
    },
  ];

  return (
    <div
      role="img"
      aria-label="Focura dashboard preview"
      className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-foreground/10"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <span className="ml-2 hidden sm:inline-block truncate rounded-md border border-border bg-background px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground">
          app.focura.com/dashboard
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr]">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col border-r border-border bg-muted/20 p-2">
          <div className="flex items-center gap-1.5 px-1.5 pb-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground text-[8px] font-bold text-background">F</div>
            <span className="text-[10px] font-semibold text-foreground">Focura</span>
          </div>
          {MOCK_NAV.map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-[9px] ${
                i === 0 ? "bg-foreground font-medium text-background" : "text-muted-foreground"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
              {label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="min-w-0 p-2.5 sm:p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-[9px] font-bold text-white">N</span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-foreground">Northwind — Q3 Roadmap</p>
              <p className="truncate text-[8px] text-muted-foreground">Product · 4 members</p>
            </div>
            <div className="ml-auto hidden md:flex shrink-0 items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[8px] font-semibold text-background">
              New Task
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {columns.map((col) => (
              <div key={col.name} className="w-1/3 shrink-0 rounded-lg bg-muted/40 p-1.5 sm:w-auto sm:min-w-37.5 sm:flex-1">
                <div className="flex items-center gap-1.5 px-0.5 pb-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${col.color}`} />
                  <p className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">{col.name}</p>
                  <span className="ml-auto rounded-full bg-muted px-1 text-muted-foreground" style={{ fontSize: 7 }}>{col.count}</span>
                </div>
                <div className="space-y-1.5">
                  {col.tasks.map((t) => (
                    <div key={t.title} className="rounded-md border border-border bg-card p-1.5 shadow-sm">
                      <p className="font-medium leading-snug text-foreground" style={{ fontSize: 8.5 }}>{t.title}</p>
                      <div className="mt-1.5">
                        <span className={`rounded-full px-1.5 py-px font-medium ${t.tagColor}`} style={{ fontSize: 6.5 }}>{t.tag}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-1 rounded-md border border-dashed border-border px-1.5 py-1 text-muted-foreground" style={{ fontSize: 7.5 }}>
                    <span className="text-foreground/60">+</span>
                    Add task
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */

export default function FeaturesHero() {
  const router = useRouter();
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-primary/10 to-transparent" />

      <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary/20 opacity-30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-10 left-0 h-72 w-72 rounded-full bg-primary/20 opacity-30 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl">
          Powerful features designed <br className="hidden md:block" />
          to <span className="text-primary">supercharge your workflow</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70 md:text-xl">
          Explore a suite of tools that help teams plan, collaborate, and
          deliver projects faster — all within an intuitive and beautifully
          designed workspace.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => router.push("/signup")}
            className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-lg font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            Get Started
            <ArrowRight size={20} />
          </button>

          <button
            onClick={() => router.push("/features/all-features")}
            className="rounded-xl border border-border/60 px-7 py-3 text-lg font-semibold text-foreground backdrop-blur-md transition-all hover:bg-foreground/5 hover:cursor-pointer"
          >
            Explore All Features
          </button>
        </div>

        <div className="relative mx-auto mt-20 max-w-4xl">
          <MiniDashboardMock />
        </div>
      </div>
    </section>
  );
}
