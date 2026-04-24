import { ShieldCheck } from "lucide-react";

export const PrivacyHero = () => {
  return (
    <div className="relative border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      {/* Subtle dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          color: "var(--color-neutral-900, #171717)",
        }}
      />

      {/* Soft glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-6 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Your Privacy Matters
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
          Privacy Policy
        </h1>

        <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          We are committed to protecting your personal data. This policy explains
          what we collect, how we use it, and the rights you have over your
          information.
        </p>

        {/* Meta info row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-neutral-400 dark:text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Effective: January 1, 2026
          </span>
          <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 inline-block" />
            Last Updated: April 24, 2026
          </span>
          <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">•</span>
          <span>GDPR &amp; CCPA Compliant</span>
        </div>
      </div>
    </div>
  );
};
