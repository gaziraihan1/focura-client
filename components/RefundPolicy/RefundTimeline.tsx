import { CreditCard, Clock, Mail, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    day: "Day 0",
    label: "Subscription charged",
    description: "Your first payment is processed by Paddle.",
    accent: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300",
  },
  {
    icon: Clock,
    day: "Days 1–7",
    label: "Refund window open",
    description:
      "You may submit a refund request at any point within this window, provided eligibility conditions are met.",
    accent:
      "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300",
    highlight: true,
  },
  {
    icon: Mail,
    day: "Before Day 7",
    label: "Submit your request",
    description:
      "Email focurabusiness@gmail.com with all required details and cancel your subscription before the next renewal.",
    accent: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300",
  },
  {
    icon: CheckCircle2,
    day: "Day 8+",
    label: "Window closed",
    description:
      "Refund requests received after 7 days from the charge date are not eligible, regardless of reason.",
    accent:
      "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400",
  },
];

export const RefundTimeline = () => {
  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-4.5 top-8 bottom-8 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

      <div className="space-y-4">
        {steps.map(({ icon: Icon, day, label, description, accent, highlight }) => (
          <div key={day} className="flex gap-4 items-start">
            {/* Circle icon */}
            <div
              className={`shrink-0 z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 ${
                highlight
                  ? "border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/40"
                  : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  highlight
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
                strokeWidth={1.8}
              />
            </div>

            {/* Card */}
            <div
              className={`flex-1 rounded-xl px-4 py-3.5 ${accent}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  {day}
                </span>
                {highlight && (
                  <span className="text-[10px] font-semibold bg-amber-200 dark:bg-amber-800/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    Act Now
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold mb-0.5">{label}</p>
              <p className="text-xs opacity-80 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};