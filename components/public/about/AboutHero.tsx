import Link from "next/link";
import { ArrowRight, Github, Star, GitFork, Zap } from "lucide-react";

export const AboutHero = () => {
  return (
    <section className="relative bg-muted/30 border-b border overflow-hidden">
      {/* Grid texture */}
      {/* <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(var(--color-foreground,#171717) 1px,transparent 1px),
            linear-gradient(90deg,var(--color-foreground,#171717) 1px,transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      /> */}

      {/* Glow orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-175 h-64 bg-muted/20 dark:bg-muted/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-40 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-40 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
        {/* Version badge */}
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground inline-block animate-pulse" />
          v1.1.0 Stable · Released August 11, 2026
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
          Focus Smarter.
          <br />
          <span className="text-muted-foreground">
            Ship Together.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          Gablura helps teams turn scattered tasks into clear priorities, protect
          deep work time, and maintain steady progress — without the complexity
          that slows everyone down.
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            href="/authentication/registration"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-5 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Zap className="w-4 h-4" strokeWidth={2} />
            Try Gablura Live
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
          <Link
            href="https://github.com/gaziraihan1/gablura-client"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border bg-card text-foreground rounded-xl px-5 py-3 text-sm font-semibold hover:bg-muted transition-colors"
          >
            <Github className="w-4 h-4" strokeWidth={1.8} />
            View on GitHub
          </Link>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: Star, label: "Open Source", value: "Source Available" },
            { icon: GitFork, label: "Commits", value: "409+" },
            { icon: Zap, label: "Deployment", value: "Vercel Edge" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs text-muted-foreground shadow-sm"
            >
              <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
              <span className="font-semibold text-foreground">
                {value}
              </span>
              <span className="text-muted-foreground">·</span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
