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
    color: "border-border bg-muted/40",
    badgeColor: "bg-muted text-foreground",
    items: [
      { name: "Next.js", version: "16.3.0", role: "App Router — SSR, RSC, API routes" },
      { name: "React", version: "19.2.0", role: "UI library with concurrent features" },
      { name: "TypeScript", version: "5.9.3", role: "Strict type safety across the codebase" },
    ],
  },
  {
    category: "Styling & Motion",
    color: "border-border bg-muted/40",
    badgeColor: "bg-muted text-foreground",
    items: [
      { name: "Tailwind CSS", version: "4.2.1", role: "Utility-first styling — v4 engine" },
      { name: "Framer Motion", version: "12.34.3", role: "Animations and page transitions" },
      { name: "Lucide React", version: "0.554.0", role: "Icon system across all UI" },
    ],
  },
  {
    category: "Data & State",
    color: "border-border bg-muted/40",
    badgeColor: "bg-muted text-foreground",
    items: [
      { name: "TanStack Query", version: "5.90.21", role: "Server state, caching, optimistic updates" },
      { name: "React Context", version: "—", role: "Built-in client state for theme & auth" },
      { name: "Axios", version: "1.18.1", role: "HTTP client with interceptors + JWT attach" },
    ],
  },
  {
    category: "Forms & Validation",
    color: "border-border bg-muted/40",
    badgeColor: "bg-muted text-foreground",
    items: [
      { name: "React Hook Form", version: "7.71.2", role: "Performant, uncontrolled form handling" },
      { name: "Zod", version: "3.25.76", role: "Runtime schema validation" },
      { name: "Recharts", version: "3.7.0", role: "Analytics charts and data visualisations" },
    ],
  },
  {
    category: "Auth & Security",
    color: "border-border bg-muted/40",
    badgeColor: "bg-muted text-foreground",
    items: [
      { name: "NextAuth.js", version: "4.24.15", role: "Session management + Google OAuth" },
      { name: "RS256 JWT", version: "—", role: "Token auth issued by backend on exchange" },
      { name: "Upstash Redis", version: "—", role: "Token revocation, rate limiting, caching" },
    ],
  },
  {
    category: "Infrastructure",
    color: "border-border bg-muted/40",
    badgeColor: "bg-muted text-foreground",
    items: [
      { name: "Vercel", version: "—", role: "Hosting, CDN edge network, preview deploys" },
      { name: "Cloudinary", version: "2.9.0", role: "File uploads, storage, media optimisation" },
      { name: "PostgreSQL + Prisma", version: "—", role: "Backend database with ORM and migrations" },
    ],
  },
];

export const AboutStack = () => {
  return (
    <section className="border-t">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        {/* Header */}
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Under the Hood
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            A stack built for
            <br />
            <span className="text-muted-foreground">
              production from day one.
            </span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed md:text-right">
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
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 block mt-1.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                          {name}
                        </span>
                        {version !== "—" && (
                          <span className="text-[11px] font-mono text-muted-foreground">
                            v{version}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
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