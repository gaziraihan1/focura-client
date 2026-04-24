import { Scale } from "lucide-react";

export const TermsHero = () => {
  return (
    <div className="relative border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(var(--color-neutral-900) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-neutral-900) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-6 shadow-sm">
          <Scale className="w-3.5 h-3.5" />
          Legal Agreement
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
          Terms &amp; Conditions
        </h1>

        <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Please read these terms carefully before using Focura. By accessing or
          using our platform, you agree to be bound by these terms.
        </p>

        {/* Meta info */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-neutral-400 dark:text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Effective: January 1, 2026
          </span>
          <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">
            •
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 inline-block" />
            Last Updated: April 24, 2026
          </span>
          <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">
            •
          </span>
          <span>Version 2.0</span>
        </div>
      </div>
    </div>
  );
};
