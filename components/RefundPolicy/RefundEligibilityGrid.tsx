import { CheckCircle2, XCircle } from "lucide-react";

const eligible = [
  "First-time subscription purchase (any paid plan)",
  "Proven technical issue preventing core feature use",
  "Request submitted within 7 days of the charge date",
  "Account shows minimal / light usage (not heavily used)",
  "Subscription cancelled before the next renewal date",
];

const notEligible = [
  "Subscription renewals (monthly or annual)",
  "Partial usage — you used the product and then changed your mind",
  "Accounts with heavy usage: many tasks, workspaces, or sessions created",
  "Downgrade from a higher plan to a lower plan",
  "Refund request submitted after the 7-day window",
  "Account suspended or terminated for policy violations",
  "Payments processed by third-party resellers or app stores",
];

export const RefundEligibilityGrid = () => {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Eligible */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2
            className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400"
            strokeWidth={2}
          />
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Eligible for Refund
          </p>
        </div>
        <ul className="space-y-2.5">
          {eligible.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <CheckCircle2
                className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5"
                strokeWidth={2.5}
              />
              <span className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Not eligible */}
      <div className="rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20 p-5">
        <div className="flex items-center gap-2 mb-4">
          <XCircle
            className="w-4.5 h-4.5 text-red-600 dark:text-red-400"
            strokeWidth={2}
          />
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            Not Eligible for Refund
          </p>
        </div>
        <ul className="space-y-2.5">
          {notEligible.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <XCircle
                className="w-3.5 h-3.5 text-red-400 dark:text-red-400 shrink-0 mt-0.5"
                strokeWidth={2.5}
              />
              <span className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};