import { MessageSquare } from "lucide-react";

export const ContactHero = () => {
  return (
    <div className="relative border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(var(--color-neutral-900,#171717) 1px,transparent 1px),
            linear-gradient(90deg,var(--color-neutral-900,#171717) 1px,transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-44 bg-blue-400/5 dark:bg-blue-300/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-6 shadow-sm">
          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
          Get in Touch
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
          Contact Focura
        </h1>

        <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Have a question, found a bug, or want to explore a partnership? Fill
          in the form and we&apos;ll get back to you within 2 business days.
        </p>

        {/* Meta pills */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-neutral-400 dark:text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Response within 2 business days
          </span>
          <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 inline-block" />
            Mon – Fri · 9 AM – 6 PM (GMT+6)
          </span>
          <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">•</span>
          <span>All enquiries welcome</span>
        </div>
      </div>
    </div>
  );
};