"use client";

import { Rocket, Briefcase, Globe } from "lucide-react";
import { cases } from "@/constants/features.constants";

const ICONS = [Rocket, Briefcase, Globe];
const THEMES = [
  {
    chip: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    header: "from-indigo-500/15 via-indigo-500/5 to-transparent",
  },
  {
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    header: "from-emerald-500/15 via-emerald-500/5 to-transparent",
  },
  {
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    header: "from-amber-500/15 via-amber-500/5 to-transparent",
  },
];

export default function UseCases() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl space-y-4 px-6 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Use Cases <span className="text-primary">For Any Team</span>
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Focura adapts to your workflow — whether you&apos;re a founder,
          agency, or a remote team.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl gap-8 px-6 md:grid-cols-3">
        {cases.map((c, i) => {
          const Icon = ICONS[i % ICONS.length];
          const theme = THEMES[i % THEMES.length];
          return (
            <div
              key={i}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5"
            >
              <div className={`relative h-32 w-full bg-linear-to-b ${theme.header}`}>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-md transition-transform duration-300 group-hover:scale-110 ${theme.chip}`}>
                    <Icon size={26} />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-semibold text-foreground">{c.title}</h3>
                <p className="text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
