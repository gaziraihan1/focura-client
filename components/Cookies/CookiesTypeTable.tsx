import { cn } from "@/lib/utils";

interface CookieRow {
  name: string;
  type: string;
  purpose: string;
  duration: string;
  required: boolean;
}

const cookies: CookieRow[] = [
  // Strictly Necessary
  {
    name: "focura_session",
    type: "Strictly Necessary",
    purpose: "Maintains your authenticated session so you stay logged in across page navigations.",
    duration: "Session",
    required: true,
  },
  {
    name: "focura_csrf",
    type: "Strictly Necessary",
    purpose: "CSRF protection token — prevents cross-site request forgery attacks on form submissions.",
    duration: "Session",
    required: true,
  },
  {
    name: "focura_auth_refresh",
    type: "Strictly Necessary",
    purpose: "Stores an encrypted refresh token to silently renew your access token without re-login.",
    duration: "30 days",
    required: true,
  },
  // Functional
  {
    name: "focura_theme",
    type: "Functional",
    purpose: "Remembers your chosen theme (light / dark / system) so it persists between sessions.",
    duration: "1 year",
    required: false,
  },
  {
    name: "focura_sidebar",
    type: "Functional",
    purpose: "Saves your sidebar collapsed/expanded state and last-visited workspace.",
    duration: "6 months",
    required: false,
  },
  {
    name: "focura_locale",
    type: "Functional",
    purpose: "Stores your preferred language and date/time format settings.",
    duration: "1 year",
    required: false,
  },
  // Analytics
  {
    name: "_fp_analytics",
    type: "Analytics",
    purpose: "Tracks anonymous page views, feature interactions, and session duration to improve the product.",
    duration: "13 months",
    required: false,
  },
  {
    name: "_fp_distinct_id",
    type: "Analytics",
    purpose: "A randomly generated anonymous identifier used to distinguish unique visitors in aggregated reports.",
    duration: "13 months",
    required: false,
  },
];

const typeBadge: Record<string, string> = {
  "Strictly Necessary":
    "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50",
  Functional:
    "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
  Analytics:
    "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50",
};

export const CookiesTypeTable = () => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800">
            <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
              Cookie Name
            </th>
            <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
              Type
            </th>
            <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">
              Purpose
            </th>
            <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
              Duration
            </th>
            <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
              Consent
            </th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((row, i) => (
            <tr
              key={row.name}
              className={
                i < cookies.length - 1
                  ? "border-b border-neutral-100 dark:border-neutral-800/60"
                  : ""
              }
            >
              <td className="px-4 py-3 align-top">
                <span className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                  {row.name}
                </span>
              </td>
              <td className="px-4 py-3 align-top whitespace-nowrap">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    typeBadge[row.type]
                  )}
                >
                  {row.type}
                </span>
              </td>
              <td className="px-4 py-3 align-top text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
                {row.purpose}
              </td>
              <td className="px-4 py-3 align-top text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                {row.duration}
              </td>
              <td className="px-4 py-3 align-top whitespace-nowrap">
                {row.required ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 inline-block" />
                    Not required
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
                    Required
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};