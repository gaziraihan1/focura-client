import {
  LayoutGrid,
  Kanban,
  Timer,
  Bell,
  BarChart2,
  FolderOpen,
  CreditCard,
  Shield,
} from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  highlights: string[];
  accent: string;
  iconBg: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    icon: LayoutGrid,
    title: "Task & Project Management",
    description:
      "Full-featured task lifecycle from creation to completion — with subtasks, dependencies, recurring schedules, priorities, and bulk operations.",
    highlights: [
      "Subtask hierarchy",
      "Task dependencies",
      "Recurring schedules",
      "Bulk operations",
    ],
    accent: "border-blue-200 dark:border-blue-800/50",
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Kanban,
    title: "Four Work Views",
    description:
      "Switch between List, Kanban Board, Calendar, and Daily Tasks — each optimised for a different planning style with drag-and-drop support.",
    highlights: ["List view", "Kanban board", "Calendar view", "Daily planner"],
    accent: "border-violet-200 dark:border-violet-800/50",
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: Timer,
    title: "Focus Sessions",
    description:
      "Built-in Pomodoro, deep work, and custom focus modes with time tracking and productivity analytics. Protect uninterrupted work time.",
    highlights: ["Pomodoro mode", "Deep work", "Custom sessions", "Analytics"],
    accent: "border-emerald-200 dark:border-emerald-800/50",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Bell,
    title: "Real-Time Collaboration",
    description:
      "Comments, @mentions, team notifications, and an activity feed — all delivered instantly via Server-Sent Events without page refreshes.",
    highlights: ["SSE real-time", "@mentions", "Activity feed", "Announcements"],
    accent: "border-amber-200 dark:border-amber-800/50",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: BarChart2,
    title: "Analytics & Insights",
    description:
      "Workspace dashboards with task completion rates, focus session stats, team activity tracking, capacity visualisation, and custom charts.",
    highlights: ["Completion rates", "Focus metrics", "Team activity", "Charts"],
    accent: "border-rose-200 dark:border-rose-800/50",
    iconBg: "bg-rose-50 dark:bg-rose-950/40",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    icon: FolderOpen,
    title: "File & Storage Management",
    description:
      "Cloudinary-backed file uploads and attachments with a built-in browser UI, storage usage tracking, and optimisation tools.",
    highlights: ["Cloudinary CDN", "Storage tracking", "File browser", "Optimization"],
    accent: "border-cyan-200 dark:border-cyan-800/50",
    iconBg: "bg-cyan-50 dark:bg-cyan-950/40",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: CreditCard,
    title: "Billing & Subscriptions",
    description:
      "Stripe-powered plan management with billing history, invoices, usage-aware plan limits, and subscription status tracking.",
    highlights: ["Stripe payments", "Plan limits", "Billing history", "Invoices"],
    accent: "border-neutral-200 dark:border-neutral-700",
    iconBg: "bg-neutral-100 dark:bg-neutral-800",
    iconColor: "text-neutral-600 dark:text-neutral-400",
  },
  {
    icon: Shield,
    title: "Role-Based Access Control",
    description:
      "Owner, Admin, and Member roles with workspace-scoped data isolation. RS256 JWT auth, Argon2 hashing, HTTP-only cookies, and audit logging.",
    highlights: ["3 role levels", "RS256 JWT", "Audit logs", "RBAC middleware"],
    accent: "border-neutral-200 dark:border-neutral-700",
    iconBg: "bg-neutral-100 dark:bg-neutral-800",
    iconColor: "text-neutral-600 dark:text-neutral-400",
  },
];

export const AboutFeatures = () => {
  return (
    <section className="border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        {/* Header */}
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
          What Focura Ships
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
            Everything a team needs.
            <br />
            <span className="text-neutral-400 dark:text-neutral-500">
              Nothing it doesn&apos;t.
            </span>
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed md:text-right">
            8 core feature areas, 80+ custom hooks, and a fully typed API
            layer.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {features.map(
            ({
              icon: Icon,
              title,
              description,
              highlights,
              accent,
              iconBg,
              iconColor,
            }) => (
              <div
                key={title}
                className={`rounded-2xl border bg-white dark:bg-neutral-900 p-6 space-y-4 hover:shadow-sm transition-shadow ${accent}`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
                >
                  <Icon className={`w-4.5 h-4.5 ${iconColor}`} strokeWidth={1.8} />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1.5">
                    {title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Highlight tags */}
                <div className="flex flex-wrap gap-1.5">
                  {highlights.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-[11px] font-medium px-2.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};