"use client";

import React from "react";
import Link from "next/link";

export default function PricingSupportCTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div
          className="max-w-3xl mx-auto rounded-2xl border border-border 
                     bg-muted/40 dark:bg-muted/20 backdrop-blur-xl 
                     p-10 text-center shadow-sm"
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground">
            Still have questions?
          </h3>

          <p className="text-muted-foreground mt-3 md:text-lg">
            Our support team is here 24/7 to help you find the right plan for
            your workflow.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center mt-6 px-6 py-3
                       rounded-xl bg-primary text-primary-foreground font-medium
                       hover:bg-primary/90 transition-all shadow-md shadow-primary/20
                       text-sm md:text-base"
          >
            Contact Support
          </Link>

          <p className="text-xs text-muted-foreground mt-4">
            Average response time: under 2 hours
          </p>
        </div>
      </div>
    </section>
  );
}
