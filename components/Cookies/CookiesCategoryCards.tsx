import { ShieldCheck, Settings2, BarChart2 } from "lucide-react";

const categories = [
  {
    icon: ShieldCheck,
    label: "Strictly Necessary",
    color:
      "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/60",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400",
    badgeLabel: "Always On",
    count: 3,
    description:
      "Essential for authentication, session management, and security. These cannot be disabled — without them the platform will not function.",
    examples: ["Session tokens", "CSRF tokens", "Auth refresh tokens"],
  },
  {
    icon: Settings2,
    label: "Functional",
    color:
      "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/60",
    badge:
      "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-400",
    badgeLabel: "Opt-Out",
    count: 3,
    description:
      "Remember your personal preferences such as theme and sidebar state. Disabling these will not break the app, but your preferences will reset on each visit.",
    examples: ["Theme preference", "Sidebar state", "Language / locale"],
  },
  {
    icon: BarChart2,
    label: "Analytics",
    color:
      "bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-900/60",
    badge:
      "bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-400",
    badgeLabel: "Consent Required",
    count: 2,
    description:
      "Collect anonymised, aggregated data about how users interact with Focura. All data is non-identifiable and used solely to improve the product. Requires your explicit consent.",
    examples: ["Page views", "Feature interactions", "Session duration"],
  },
];

export const CookiesCategoryCards = () => {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {categories.map(
        ({
          icon: Icon,
          label,
          color,
          iconColor,
          iconBg,
          badge,
          badgeLabel,
          count,
          description,
          examples,
        }) => (
          <div
            key={label}
            className={`rounded-xl border p-5 space-y-3 ${color}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div
                className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}
              >
                <Icon className={`w-4.5 h-4.5 ${iconColor}`} strokeWidth={1.8} />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 h-fit ${badge}`}
              >
                {badgeLabel}
              </span>
            </div>

            {/* Title + count */}
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5">
                {label}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {count} cookie{count !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {description}
            </p>

            {/* Examples */}
            <ul className="space-y-1">
              {examples.map((ex) => (
                <li
                  key={ex}
                  className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400"
                >
                  <span className="shrink-0 w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
};