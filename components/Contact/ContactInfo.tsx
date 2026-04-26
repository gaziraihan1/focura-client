import {
  Mail,
  Clock,
  ShieldAlert,
  CreditCard,
  Wrench,
  Lightbulb,
  Handshake,
} from "lucide-react";

const channels = [
  {
    icon: Mail,
    label: "General & Billing",
    value: "focurabusiness@gmail.com",
    href: "mailto:focurabusiness@gmail.com",
    description: "For all general enquiries, billing questions, and partnerships.",
  },
  {
    icon: ShieldAlert,
    label: "Security Issues",
    value: "security@focura.app",
    href: "mailto:security@focura.app",
    description:
      "Responsible disclosure only — please do not open public GitHub issues for vulnerabilities.",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon – Fri · 9 AM – 6 PM",
    href: null,
    description: "GMT+6 · We aim to reply within 2 business days.",
  },
];

const categories = [
  { icon: Wrench, label: "Technical Issue", color: "text-rose-500" },
  { icon: CreditCard, label: "Billing & Plans", color: "text-amber-500" },
  { icon: Lightbulb, label: "Feature Request", color: "text-violet-500" },
  { icon: Handshake, label: "Partnership", color: "text-emerald-500" },
];

export const ContactInfo = () => {
  return (
    <div className="space-y-5">
      {/* Channel cards */}
      {channels.map(({ icon: Icon, label, value, href, description }) => (
        <div
          key={label}
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5"
        >
          <div className="flex items-start gap-3 mb-2">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-300" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-0.5">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-300 dark:decoration-neutral-600 hover:decoration-neutral-600 dark:hover:decoration-neutral-400 transition-colors break-all"
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {value}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pl-11">
            {description}
          </p>
        </div>
      ))}

      {/* What can I contact you about */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
        <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4">
          What we help with
        </p>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 px-3 py-2.5"
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} strokeWidth={2} />
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SLA notice */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-3.5">
        <div className="flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5 animate-pulse" />
          <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
            <strong className="font-semibold">Auto-reply is instant.</strong>{" "}
            You&apos;ll receive a confirmation email as soon as you submit the form.
            A human response follows within 2 business days.
          </p>
        </div>
      </div>
    </div>
  );
};