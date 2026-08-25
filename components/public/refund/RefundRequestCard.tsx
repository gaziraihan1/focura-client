"use client";
import {
  Mail,
  User,
  CreditCard,
  Calendar,
  FileText,
  Layers,
  MessageSquare,
  Copy,
} from "lucide-react";

const fields = [
  {
    icon: User,
    label: "Full Name",
    example: "The name used when you signed up.",
  },
  {
    icon: Mail,
    label: "Registered Email Address",
    example: "The email linked to your Focura account.",
  },
  {
    icon: CreditCard,
    label: "Paddle Transaction / Order ID",
    example: "Found in your Paddle payment receipt email (e.g. 123456-789).",
  },
  {
    icon: Calendar,
    label: "Date of Charge",
    example: "The exact date the subscription payment was processed.",
  },
  {
    icon: Layers,
    label: "Plan Purchased",
    example: "e.g. Focura Pro Monthly / Focura Pro Annual.",
  },
  {
    icon: FileText,
    label: "Reason for Refund",
    example:
      "A clear and honest explanation. If a technical issue, describe it in detail (screenshots or screen recordings are helpful).",
  },
  {
    icon: MessageSquare,
    label: "Steps You Already Tried",
    example:
      "What you did to resolve the issue before requesting a refund (e.g. contacted support, cleared cache, tried a different browser).",
  },
];

export const RefundRequestCard = () => {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
            <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Send your request to
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Include every field below — incomplete requests will be delayed
            </p>
          </div>
        </div>
      </div>

      {/* Email address pill */}
      <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
            <span className="text-sm font-mono font-semibold text-neutral-800 dark:text-neutral-200 select-all">
              focurabusiness@gmail.com
            </span>
          </div>
          <button
            onClick={() =>
              navigator.clipboard.writeText("focurabusiness@gmail.com")
            }
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            title="Copy email address"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy</span>
          </button>
        </div>
      </div>

      {/* Subject line hint */}
      <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-blue-50/50 dark:bg-blue-950/10">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            Suggested subject line:{" "}
          </span>
          <span className="font-mono">
            Refund Request — [Your Name] — [Order ID]
          </span>
        </p>
      </div>

      {/* Required fields */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {fields.map(({ icon: Icon, label, example }) => (
          <div
            key={label}
            className="flex items-start gap-4 px-5 py-4 group hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
          >
            <div className="shrink-0 w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mt-0.5">
              <Icon
                className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400"
                strokeWidth={1.8}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
                {label}
                <span className="ml-1.5 text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wide">
                  Required
                </span>
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {example}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="px-5 py-4 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-800">
        <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">
          We review all refund requests within{" "}
          <strong className="text-neutral-600 dark:text-neutral-300 font-semibold">
            3–5 business days
          </strong>
          . If approved, Paddle will process the refund to your original payment
          method within{" "}
          <strong className="text-neutral-600 dark:text-neutral-300 font-semibold">
            5–10 business days
          </strong>
          , depending on your bank.
        </p>
      </div>
    </div>
  );
};