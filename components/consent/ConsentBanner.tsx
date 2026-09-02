"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useConsent } from "./ConsentProvider";

/**
 * Fixed bottom consent banner shown once until the visitor accepts or
 * declines analytics cookies. The choice is persisted by ConsentProvider.
 */
export function ConsentBanner() {
  const { accept, decline } = useConsent();

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div
        aria-live="polite"
        className="pointer-events-auto mx-auto w-full max-w-3xl motion-safe:animate-in motion-safe:slide-in-from-bottom-6 motion-safe:fade-in motion-safe:duration-300 rounded-2xl border border-border bg-card/95 shadow-2xl shadow-black/10 backdrop-blur-md dark:shadow-black/50"
      >
        <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
              <Cookie className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-sm font-semibold text-foreground">
                We respect your privacy
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Strictly necessary cookies keep Focura working — no consent
                needed. Google Analytics is optional and only loads if you
                accept. You can change your choice at any time — see our{" "}
                <Link
                  href="/cookies"
                  className="font-medium text-primary underline underline-offset-2 decoration-primary/40 transition-colors hover:decoration-primary"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col xl:flex-row">
            <Button
              type="button"
              variant="primary"
              onClick={accept}
              className="flex-1 gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold focus-visible:outline-none lg:flex-none"
            >
              Accept
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={decline}
              className="flex-1 gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold focus-visible:outline-none lg:flex-none"
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
