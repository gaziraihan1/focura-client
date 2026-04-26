import { cn } from "@/lib/utils";

interface StackItem {
  name: string;
  version: string;
  role: string;
}

interface StackGroup {
  category: string;
  color: string;
  badgeColor: string;
  items: StackItem[];
}

const stackGroups: StackGroup[] = [
  {
    category: "Core Framework",
    color: "border-blue-200 dark:border-blue-800/50 bg-blue-50/40 dark:bg-blue-950/10",
    badgeColor: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400",
    items: [
      { name: "Next.js", version: "16.0.10", role: "App Router — SSR, RSC, API routes" },
      { name: "React", version: "19.2.0", role: "UI library with concurrent features" },
      { name: "TypeScript", version: "5.9.3", role: "Strict type safety across the codebase" },
    ],
  },
  {
    category: "Styling & Motion",
    color: "border-violet-200 dark:border-violet-800/50 bg-violet-50/40 dark:bg-violet-950/10",
    badgeColor: "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-400",
    items: [
      { name: "Tailwind CSS", version: "4.0", role: "Utility-first styling — v4 engine" },
      { name: "Framer Motion", version: "12.23.24", role: "Animations and page transitions" },
      { name: "Lucide React", version: "0.554.0", role: "Icon system across all UI" },
    ],
  },
  {
    category: "Data & State",
    color: "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/40 dark:bg-emerald-950/10",
    badgeColor: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400",
    items: [
      { name: "TanStack Query", version: "5.90.21", role: "Server state, caching, optimistic updates" },
      { name: "Redux Toolkit", version: "2.11.0", role: "Client-side global state slices" },
      { name: "Axios", version: "1.13.2", role: "HTTP client with interceptors + JWT attach" },
    ],
  },
  {
    category: "Forms & Validation",
    color: "border-amber-200 dark:border-amber-800/50 bg-amber-50/40 dark:bg-amber-950/10",
    badgeColor: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400",
    items: [
      { name: "React Hook Form", version: "7.66.1", role: "Performant, uncontrolled form handling" },
      { name: "Zod", version: "4.1.13", role: "Runtime schema validation" },
      { name: "Recharts", version: "3.7.0", role: "Analytics charts and data visualisations" },
    ],
  },
  {
    category: "Auth & Security",
    color: "border-rose-200 dark:border-rose-800/50 bg-rose-50/40 dark:bg-rose-950/10",
    badgeColor: "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400",
    items: [
      { name: "NextAuth.js", version: "4.24.13", role: "Session management + Google OAuth" },
      { name: "RS256 JWT", version: "—", role: "Token auth issued by backend on exchange" },
      { name: "Upstash Redis", version: "—", role: "Token revocation, rate limiting, caching" },
    ],
  },
  {
    category: "Infrastructure",
    color: "border-neutral-200 dark:border-neutral-700 bg-neutral-50/40 dark:bg-neutral-900/30",
    badgeColor: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
    items: [
      { name: "Vercel", version: "—", role: "Hosting, CDN edge network, preview deploys" },
      { name: "Cloudinary", version: "2.8.0", role: "File uploads, storage, media optimisation" },
      { name: "PostgreSQL + Prisma", version: "—", role: "Backend database with ORM and migrations" },
    ],
  },
];

export const AboutStack = () => {
  return (
    <section className="border-t border-neutral-100 dark:border-neutral-800/60">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        {/* Header */}
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
          Under the Hood
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
            A stack built for
            <br />
            <span className="text-neutral-400 dark:text-neutral-500">
              production from day one.
            </span>
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed md:text-right">
            Every technology was chosen deliberately — not for hype, but for
            correctness, performance, and maintainability.
          </p>
        </div>

        {/* Stack groups */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stackGroups.map(({ category, color, badgeColor, items }) => (
            <div
              key={category}
              className={cn(
                "rounded-2xl border p-5 space-y-4",
                color
              )}
            >
              <span
                className={cn(
                  "inline-block text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5",
                  badgeColor
                )}
              >
                {category}
              </span>

              <ul className="space-y-3">
                {items.map(({ name, version, role }) => (
                  <li key={name} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 block mt-1.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {name}
                        </span>
                        {version !== "—" && (
                          <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                            v{version}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-0.5">
                        {role}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};