import Link from "next/link";
import { ArrowRight, Github, Star, GitFork, Zap } from "lucide-react";

export const AboutHero = () => {
  return (
    <section className="relative bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(var(--color-neutral-900,#171717) 1px,transparent 1px),
            linear-gradient(90deg,var(--color-neutral-900,#171717) 1px,transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-175 h-64 bg-neutral-300/20 dark:bg-neutral-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-40 bg-violet-400/5 dark:bg-violet-300/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-40 bg-emerald-400/5 dark:bg-emerald-300/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
        {/* Version badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          v1.0.0 Stable · Released April 5, 2026
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-6 leading-[1.05]">
          Focus Smarter.
          <br />
          <span className="text-neutral-400 dark:text-neutral-500">
            Ship Together.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Focura helps teams turn scattered tasks into clear priorities, protect
          deep work time, and maintain steady progress — without the complexity
          that slows everyone down.
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            href="https://focura-client.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-xl px-5 py-3 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
          >
            <Zap className="w-4 h-4" strokeWidth={2} />
            Try Focura Live
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
          <Link
            href="https://github.com/gaziraihan1/focura-client"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-xl px-5 py-3 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Github className="w-4 h-4" strokeWidth={1.8} />
            View on GitHub
          </Link>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: Star, label: "Open Source", value: "Source Available" },
            { icon: GitFork, label: "Commits", value: "107+" },
            { icon: Zap, label: "Deployment", value: "Vercel Edge" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2 text-xs text-neutral-500 dark:text-neutral-400 shadow-sm"
            >
              <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                {value}
              </span>
              <span className="text-neutral-300 dark:text-neutral-600">·</span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
