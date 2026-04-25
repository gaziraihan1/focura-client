import { ReceiptText } from "lucide-react";

export const RefundHero = () => {
  return (
    <div className="relative border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      {/* Diagonal line texture */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            currentColor 0px,
            currentColor 1px,
            transparent 1px,
            transparent 12px
          )`,
          color: "var(--color-neutral-900, #171717)",
        }}
      />

      {/* Subtle amber glow — money/refund tone */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-48 bg-amber-400/5 dark:bg-amber-300/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-6 shadow-sm">
          <ReceiptText className="w-3.5 h-3.5 text-amber-500" />
          Billing &amp; Refunds
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
          Refund Policy
        </h1>

        <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          We want you to love Focura. If something isn&apos;t right, here is
          everything you need to know about requesting a refund — clearly and
          fairly.
        </p>

        {/* Meta row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-neutral-400 dark:text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            7-Day Refund Window
          </span>
          <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 inline-block" />
            Paddle-Compatible Policy
          </span>
          <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">•</span>
          <span>Effective: January 1, 2026</span>
        </div>
      </div>
    </div>
  );
};