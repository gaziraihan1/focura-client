import {
  ShieldCheck,
  Cpu,
  Puzzle,
  TestTube2,
  Eye,
  Zap,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Security is Non-Negotiable",
    body: "RS256 JWT auth, Argon2id password hashing, HTTP-only cookies, CORS enforcement, rate limiting, timing-safe comparisons, and workspace-scoped data isolation. Security isn't a feature — it's the baseline.",
    tag: "Security-First",
    tagColor: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400",
  },
  {
    icon: Cpu,
    title: "Performance by Default",
    body: "Server Components minimise client JS. TanStack Query deduplicates requests and applies optimistic updates. Vercel Edge Network delivers assets globally. Speed is a design constraint, not an afterthought.",
    tag: "Performance",
    tagColor: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400",
  },
  {
    icon: Puzzle,
    title: "Composable Architecture",
    body: "80+ custom hooks encapsulate all data-fetching and side-effect logic. Components are thin. Business logic is reusable. The codebase is structured to be extended, not rewritten.",
    tag: "Composability",
    tagColor: "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-400",
  },
  {
    icon: Eye,
    title: "Full Type Safety",
    body: "TypeScript in strict mode across 98.5% of the codebase. Zod schemas validate all runtime inputs. API responses are fully typed end-to-end. If it compiles, it's correct by construction.",
    tag: "Type Safety",
    tagColor: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400",
  },
  {
    icon: TestTube2,
    title: "Designed to be Tested",
    body: "Vitest for unit tests, Playwright for E2E. Custom hooks are isolated and testable. The architecture separates concerns so that every layer can be verified independently.",
    tag: "Testability",
    tagColor: "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400",
  },
  {
    icon: Zap,
    title: "Real-Time Without Compromise",
    body: "Server-Sent Events deliver notifications instantly without WebSocket infrastructure overhead. The useNotifications hook handles reconnection, backoff, and cache invalidation transparently.",
    tag: "Real-Time",
    tagColor: "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-400",
  },
];

export const AboutValues = () => {
  return (
    <section className="border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        {/* Header */}
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
          Engineering Principles
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
            Values baked into
            <br />
            <span className="text-neutral-400 dark:text-neutral-500">
              every line of code.
            </span>
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed md:text-right">
            These are not aspirations — they are verifiable properties of the
            Focura codebase.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map(({ icon: Icon, title, body, tag, tagColor }) => (
            <div
              key={title}
              className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 hover:shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
            >
              {/* Icon + tag row */}
              <div className="flex items-start justify-between gap-3">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon
                    className="w-4.5 h-4.5 text-neutral-600 dark:text-neutral-300"
                    strokeWidth={1.8}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 h-fit shrink-0 ${tagColor}`}
                >
                  {tag}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  {title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};