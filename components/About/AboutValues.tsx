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
    tagColor: "bg-muted text-foreground",
  },
  {
    icon: Cpu,
    title: "Performance by Default",
    body: "Server Components minimise client JS. TanStack Query deduplicates requests and applies optimistic updates. Vercel Edge Network delivers assets globally. Speed is a design constraint, not an afterthought.",
    tag: "Performance",
    tagColor: "bg-muted text-foreground",
  },
  {
    icon: Puzzle,
    title: "Composable Architecture",
    body: "80+ custom hooks encapsulate all data-fetching and side-effect logic. Components are thin. Business logic is reusable. The codebase is structured to be extended, not rewritten.",
    tag: "Composability",
    tagColor: "bg-muted text-foreground",
  },
  {
    icon: Eye,
    title: "Full Type Safety",
    body: "TypeScript in strict mode across 98.5% of the codebase. Zod schemas validate all runtime inputs. API responses are fully typed end-to-end. If it compiles, it's correct by construction.",
    tag: "Type Safety",
    tagColor: "bg-muted text-foreground",
  },
  {
    icon: TestTube2,
    title: "Designed to be Tested",
    body: "Vitest for unit tests, Playwright for E2E. Custom hooks are isolated and testable. The architecture separates concerns so that every layer can be verified independently.",
    tag: "Testability",
    tagColor: "bg-muted text-foreground",
  },
  {
    icon: Zap,
    title: "Real-Time Without Compromise",
    body: "Server-Sent Events deliver notifications instantly without WebSocket infrastructure overhead. The useNotifications hook handles reconnection, backoff, and cache invalidation transparently.",
    tag: "Real-Time",
    tagColor: "bg-muted text-foreground",
  },
];

export const AboutValues = () => {
  return (
    <section className="border-t bg-muted/50">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        {/* Header */}
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Engineering Principles
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Values baked into
            <br />
            <span className="text-muted-foreground">
              every line of code.
            </span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed md:text-right">
            These are not aspirations — they are verifiable properties of the
            Focura codebase.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map(({ icon: Icon, title, body, tag, tagColor }) => (
            <div
              key={title}
              className="group rounded-2xl border border bg-card p-6 space-y-4 hover:shadow-sm hover:border-foreground/20 transition-colors"
            >
              {/* Icon + tag row */}
              <div className="flex items-start justify-between gap-3">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-muted flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon
                    className="w-4.5 h-4.5 text-foreground"
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
                <h3 className="text-sm font-bold text-foreground mb-1.5">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
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