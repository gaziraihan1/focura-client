import Link from "next/link";
import { Github, Globe, Code2, GitBranch, Package } from "lucide-react";
import Image from "next/image";

const stats = [
  { icon: GitBranch, label: "Commits", value: "409+" },
  { icon: Package, label: "Custom Hooks", value: "119" },
  { icon: Code2, label: "TypeScript", value: "99.9%" },
];

export const AboutFounder = () => {
  return (
    <section className="border-t">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          The Person Behind It
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight mb-5">
              Built by one developer,
              <br />
              <span className="text-muted-foreground">
                with production in mind.
              </span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Gablura was designed and built entirely by{" "}
              <strong className="font-semibold text-foreground">
                Mohammad Raihan Gazi
              </strong>{" "}
              — from the database schema and RS256 JWT auth system through to
              the Kanban board drag-and-drop (coming...), Pomodoro focus engine, and
              Paddle billing integration.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              The goal was never to ship a side project — it was to build a
              production-grade SaaS platform from scratch and learn every layer
              of the stack deeply. Gablura v1.1.0 Stable shipped on August 11,
              2026.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="https://github.com/gaziraihan1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border  bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Github className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                @gaziraihan1
              </Link>
              <Link
                href="https://gablura-client.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Globe className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                gablura-client.vercel.app
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="h-20 bg-muted relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      currentColor 0px,
                      currentColor 1px,
                      transparent 1px,
                      transparent 14px
                    )`,
                    color: "var(--color-muted-foreground,#a3a3a3)",
                  }}
                />
              </div>

              <div className="px-6 pb-6">
                <div className="-mt-7 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-background shadow-md">
  <Image
    src="/gablura-founder.jpg"
    alt="Mohammad Raihan Gazi"
    width={56}
    height={56}
    className="w-full h-full object-cover scale-105"
  />
</div>
                </div>
                <p className="text-base font-bold text-foreground">
                  Mohammad Raihan Gazi
                </p>
                <p className="text-sm text-muted-foreground mt-0.5 mb-4">
                  Creator &amp; Maintainer · Gablura
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Next.js", "React 19", "TypeScript", "Express", "PostgreSQL", "Prisma ORM", "Redis", "Paddle"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-muted border text-muted-foreground text-[11px] font-medium px-2.5 py-0.5"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border bg-card p-4 text-center"
                >
                  <Icon
                    className="w-4 h-4 text-muted-foreground mx-auto mb-2"
                    strokeWidth={1.8}
                  />
                  <p className="text-base font-bold text-foreground">
                    {value}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Repo languages */}
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-3">
                Repository Languages
              </p>
              {/* Language bar */}
              <div className="flex rounded-full overflow-hidden h-2 mb-3 gap-px">
                <div className="bg-primary" style={{ width: "99.9%" }} />
                <div className="bg-muted flex-1" />
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {[
                  { color: "bg-primary", label: "TypeScript", pct: "99.9%" },
                  { color: "bg-muted", label: "Other", pct: "0.1%" },
                ].map(({ color, label, pct }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
                    {label}
                    <span className="font-semibold text-foreground">{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};