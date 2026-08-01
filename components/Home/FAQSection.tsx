"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/constants/home.constants";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-24 md:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          FAQ
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Find answers to the most common questions about Focura.
        </p>

        <div className="mt-14 space-y-3 text-left">
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-xl border transition-colors duration-300 ${
                  open ? "border-foreground/25 bg-card shadow-lg shadow-foreground/5" : "border-border bg-card/50"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-foreground">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  inert={!open}
                  aria-hidden={!open}
                  className="grid transition-all duration-300 ease-in-out"
                  style={{
                    gridTemplateRows: open ? "1fr" : "0fr",
                    opacity: open ? 1 : 0,
                  }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="px-6 pb-5 text-muted-foreground leading-relaxed">{faq.a}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
