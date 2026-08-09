"use client";

import { m as motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

/* ─── Mini workspace preview (pure CSS — replaces the missing demo-preview.png) ─── */

  const rows = [
    { name: "Design system audit", status: "Done", bar: "w-2/3 bg-green-500", color: "text-green-600" },
    { name: "Mobile nav refactor", status: "In progress", bar: "w-1/2 bg-foreground", color: "text-foreground" },
    { name: "Onboarding flow v2", status: "Planned", bar: "w-1/3 bg-foreground/40", color: "text-muted-foreground" },
  ];
function DemoPreview() {

  return (
    <div role="img" aria-label="Focura Demo" className="overflow-hidden rounded-3xl border border-border bg-background shadow-2xl shadow-foreground/10">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <span className="ml-2 hidden sm:inline-block truncate rounded-md border border-border bg-background px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground">
          app.focura.com/workspace/demo
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr]">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col border-r border-border bg-muted/20 p-2">
          <div className="flex items-center gap-1.5 px-1.5 pb-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground text-[8px] font-bold text-background">F</div>
            <span className="text-[10px] font-semibold text-foreground">Focura</span>
          </div>
          {["Dashboard", "Tasks", "Projects", "Calendar", "Wellness"].map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-[9px] ${
                i === 1 ? "bg-foreground font-medium text-background" : "text-muted-foreground"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
              {label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="min-w-0 p-3">
          <div className="flex items-center justify-between gap-2 border-b border-border pb-2.5">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-foreground">Product Sprint</p>
              <p className="truncate text-[8px] text-muted-foreground">8 tasks · 3 members</p>
            </div>
            <div className="hidden md:flex shrink-0 items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[8px] font-semibold text-background">
              + Add Task
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {rows.map((r) => (
              <div key={r.name} className="rounded-lg border border-border bg-card p-2.5">
                <div className="flex items-center gap-2">
                  <p className="min-w-0 flex-1 truncate font-medium text-foreground" style={{ fontSize: 8.5 }}>{r.name}</p>
                  <span className={`rounded-full bg-muted px-1.5 py-px font-medium ${r.color}`} style={{ fontSize: 7 }}>{r.status}</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${r.bar}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 py-2 text-muted-foreground" style={{ fontSize: 7.5 }}>
            <span className="text-foreground/60">+</span>
            Add a new task
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */

export default function InteractiveDemo() {
  return (
    <section className="relative w-full overflow-hidden py-28">
      <div className="pointer-events-none absolute top-0 left-1/3 h-[350px] w-[350px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-secondary/20 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            Experience how <span className="text-primary">Focura</span> works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
            Get a quick look at how teams plan, collaborate, and execute using
            Focura&apos;s modern and intuitive workspace.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-4xl"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border/40 bg-background/60 shadow-lg backdrop-blur-xl">
              <PlayCircle size={48} className="text-primary" />
            </div>
          </motion.div>

          <DemoPreview />
        </motion.div>

        <div className="mt-12 text-center">
          <p className="mb-6 text-foreground/70">
            Want to explore more? Take a full tour of the Focura platform.
          </p>

          <button
            className="
              rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground
              shadow-md transition hover:opacity-90
            "
          >
            Launch Full Demo
          </button>
        </div>
      </div>
    </section>
  );
}
