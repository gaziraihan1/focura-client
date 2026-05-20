import { Monitor, Server, Database, ArrowDown, ArrowRight, Wifi } from "lucide-react";

const layers = [
  {
    icon: Monitor,
    label: "Frontend Layer",
    sublabel: "Next.js 16 + React 19 + TypeScript + Tailwind v4",
    color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50",
    iconBg: "bg-blue-100 dark:bg-blue-900/60",
    iconColor: "text-blue-600 dark:text-blue-400",
    points: [
      "Server Components for zero-JS data fetching",
      "Client Components for interactive UI",
      "80+ custom hooks for data abstraction",
      "TanStack Query for caching & deduplication",
      "Optimistic UI updates via React Query",
    ],
  },
  {
    icon: Server,
    label: "Backend API Layer",
    sublabel: "Express.js + Node.js + Prisma ORM",
    color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/60",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    points: [
      "Modular monolith architecture",
      "RS256 JWT authentication on every request",
      "Role-based access control middleware",
      "Real-time notifications via SSE stream",
      "Rate limiting & audit logging via Redis",
    ],
  },
  {
    icon: Database,
    label: "Data Layer",
    sublabel: "PostgreSQL + Prisma + Upstash Redis",
    color: "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/50",
    iconBg: "bg-violet-100 dark:bg-violet-900/60",
    iconColor: "text-violet-600 dark:text-violet-400",
    points: [
      "PostgreSQL — primary relational store",
      "Prisma ORM — type-safe queries + migrations",
      "Upstash Redis — token revocation + rate limits",
      "Workspace-scoped data isolation",
      "Cloudinary — media and file storage",
    ],
  },
];

const dataFlow = [
  "User triggers action (e.g. Create Task)",
  "Custom hook fires — optimistic update applied",
  "Axios POST with RS256 JWT attached",
  "Backend validates token → checks RBAC → writes DB",
  "SSE notifies assignees in real-time",
  "TanStack Query cache updated — UI reflects truth",
];

export const AboutArchitecture = () => {
  return (
    <section className="border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        {/* Header */}
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
          How It&apos;s Built
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight mb-12">
          Architecture built to scale.
        </h2>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — layered diagram */}
          <div>
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-5">
              Three-Layer Architecture
            </p>
            <div className="space-y-2">
              {layers.map(({ icon: Icon, label, sublabel, color, iconBg, iconColor, points }, i) => (
                <div key={label}>
                  <div className={`rounded-2xl border p-5 ${color}`}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                        <Icon className={`w-4.5 h-4.5 ${iconColor}`} strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {label}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {sublabel}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {points.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400"
                        >
                          <span className="shrink-0 w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-500 mt-1.5" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {i < layers.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                          HTTPS · RS256 JWT
                        </span>
                        <ArrowDown className="w-4 h-4 text-neutral-300 dark:text-neutral-600" strokeWidth={1.5} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — data flow + SSE */}
          <div className="space-y-6">
            {/* Data flow */}
            <div>
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                Request Lifecycle (e.g. Create Task)
              </p>
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
                {dataFlow.map((step, i) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time SSE callout */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-emerald-500" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Real-Time via SSE
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    No WebSocket overhead
                  </p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                Each authenticated user holds a persistent{" "}
                <span className="font-mono text-neutral-700 dark:text-neutral-300">
                  GET /api/v1/notifications/stream
                </span>{" "}
                connection. The backend pushes events in real-time — no
                polling, no WebSocket infrastructure required.
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-mono bg-neutral-100 dark:bg-neutral-800 rounded px-1.5 py-0.5 text-neutral-700 dark:text-neutral-300">
                  useNotifications()
                </span>
                <ArrowRight className="w-3 h-3 shrink-0" />
                <span>Connects → Listens → Updates React Query cache</span>
              </div>
            </div>

            {/* Auth flow */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                Auth Token Flow
              </p>
              <div className="space-y-2">
                {[
                  ["Login / OAuth", "NextAuth validates credentials"],
                  ["HMAC proof", "Sent to backend /api/auth/exchange"],
                  ["RS256 JWT issued", "Stored in HTTP-only cookie"],
                  ["Axios interceptor", "Attaches token to every request"],
                  ["Silent refresh", "1 min before expiry — no interruption"],
                ].map(([step, detail]) => (
                  <div key={step} className="flex items-start gap-2.5 text-xs">
                    <ArrowRight className="w-3 h-3 shrink-0 text-neutral-400 dark:text-neutral-500 mt-0.5" />
                    <span>
                      <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {step}
                      </strong>{" "}
                      <span className="text-neutral-500 dark:text-neutral-400">
                        — {detail}
                      </span>
                    </span>
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