import Link from "next/link";
import { Github, Globe, Code2, GitBranch, Package } from "lucide-react";
import Image from "next/image";

const stats = [
  { icon: GitBranch, label: "Commits", value: "130+" },
  { icon: Package, label: "Custom Hooks", value: "80+" },
  { icon: Code2, label: "TypeScript", value: "99.9%" },
];

export const AboutFounder = () => {
  return (
    <section className="border-t border-neutral-100 dark:border-neutral-800/60">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
          The Person Behind It
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight mb-5">
              Built by one developer,
              <br />
              <span className="text-neutral-400 dark:text-neutral-500">
                with production in mind.
              </span>
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-5">
              Focura was designed and built entirely by{" "}
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Mohammad Raihan Gazi
              </strong>{" "}
              — from the database schema and RS256 JWT auth system through to
              the Kanban board drag-and-drop (coming...), Pomodoro focus engine, and
              Paddle billing integration.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
              The goal was never to ship a side project — it was to build a
              production-grade SaaS platform from scratch and learn every layer
              of the stack deeply. Focura v1.0.0 Stable shipped on April 5,
              2026.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="https://github.com/gaziraihan1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <Github className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                @gaziraihan1
              </Link>
              <Link
                href="https://focura-client.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <Globe className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                focura-client.vercel.app
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="h-20 bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden">
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
                    color: "var(--color-neutral-400,#a3a3a3)",
                  }}
                />
              </div>

              <div className="px-6 pb-6">
                <div className="-mt-7 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-neutral-900 shadow-md">
  <Image
    src="/focura-founder.jpg"
    alt="Mohammad Raihan Gazi"
    width={56}
    height={56}
    className="w-full h-full object-cover scale-105"
  />
</div>
                </div>
                <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Mohammad Raihan Gazi
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 mb-4">
                  Creator &amp; Maintainer · Focura
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Next.js", "React 19", "TypeScript", "Express", "PostgreSQL", "Prisma ORM", "Redis", "Paddle"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-[11px] font-medium px-2.5 py-0.5"
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
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center"
                >
                  <Icon
                    className="w-4 h-4 text-neutral-400 dark:text-neutral-500 mx-auto mb-2"
                    strokeWidth={1.8}
                  />
                  <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {value}
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Repo languages */}
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
                Repository Languages
              </p>
              {/* Language bar */}
              <div className="flex rounded-full overflow-hidden h-2 mb-3 gap-px">
                <div className="bg-blue-500" style={{ width: "99.9%" }} />
                <div className="bg-neutral-300 dark:bg-neutral-600 flex-1" />
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {[
                  { color: "bg-blue-500", label: "TypeScript", pct: "99.9%" },
                  { color: "bg-neutral-300 dark:bg-neutral-600", label: "Other", pct: "0.1%" },
                ].map(({ color, label, pct }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
                    {label}
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{pct}</span>
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