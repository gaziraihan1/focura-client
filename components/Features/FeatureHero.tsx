"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function FeaturesHero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-primary/10 to-transparent pointer-events-none" />

      <div className="absolute -top-20 right-0 w-72 h-72 bg-primary/20 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute -bottom-10 left-0 w-72 h-72 bg-primary/20 rounded-full blur-[120px] opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
          Powerful features designed <br className="hidden md:block" />
          to <span className="text-primary">supercharge your workflow</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
          Explore a suite of tools that help teams plan, collaborate, and
          deliver projects faster — all within an intuitive and beautifully
          designed workspace.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all flex items-center gap-2">
            Get Started
            <ArrowRight size={20} />
          </button>

          <button className="px-7 py-3 rounded-xl border border-border/60 text-foreground font-semibold text-lg hover:bg-foreground/5 transition-all backdrop-blur-md">
            Explore All Features
          </button>
        </div>

        <div className="mt-20 relative mx-auto max-w-4xl">
          <div className="absolute inset-0 rounded-2xl border border-border/40 bg-background/40 backdrop-blur-xl pointer-events-none" />

          <Image
            width={300}
            height={200}
            src="/placeholder/features-hero.png"
            alt="Focura dashboard preview"
            className="rounded-2xl w-full shadow-xl border border-border/50"
          />
        </div>
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full text-background"
        height="80"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,0 C300,80 1140,-40 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </section>
  );
}
