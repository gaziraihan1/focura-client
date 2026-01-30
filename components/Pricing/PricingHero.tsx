"use client";

import React from "react";
import { Check } from "lucide-react";

export default function PricingHero() {
  return (
    <section className="relative overflow-hidden py-28 bg-background">
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
          Simple, transparent pricing
        </h1>

        <p className="mt-4 text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
          Choose a plan that scales with your team. No hidden fees, no contracts
          — just clarity.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/70">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            No credit card required
          </div>

          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            Cancel anytime
          </div>

          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            14-day free trial
          </div>
        </div>
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full h-20 text-background translate-y-1"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,40 C360,120 1080,-20 1440,40 L1440,120 L0,120 Z"
        />
      </svg>
    </section>
  );
}
