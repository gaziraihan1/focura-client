import { Cookie } from "lucide-react";

export const CookiesHero = () => {
  return (
    <div className="relative border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          color: "var(--color-neutral-900, #171717)",
        }}
      />

      {/* Soft violet glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-120 h-44 bg-violet-400/5 dark:bg-violet-300/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-6 shadow-sm">
          <Cookie className="w-3.5 h-3.5 text-violet-500" />
          Tracking & Preferences
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
          Cookie Policy
        </h1>

        <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          We use cookies to keep Focura working, remember your preferences, and
          understand how the product is used. Here is exactly what we set, why,
          and how you can control it.
        </p>

        {/* Meta row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-neutral-400 dark:text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
            Effective: January 1, 2026
          </span>
          <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 inline-block" />
            Last Updated: April 25, 2026
          </span>
          <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">•</span>
          <span>GDPR &amp; ePrivacy Compliant</span>
        </div>
      </div>
    </div>
  );
};