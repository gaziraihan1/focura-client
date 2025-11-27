"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Yes! You can upgrade or downgrade your plan at any time directly from your dashboard. Changes take effect immediately.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day refund window for all paid plans if you are not satisfied with the service.",
  },
  {
    q: "Is there a free trial for premium features?",
    a: "Yes, Pro features include a 7-day free trial with full access. No credit card required.",
  },
  {
    q: "Do you offer team or enterprise pricing?",
    a: "Business plans support teams up to 50 members. For custom enterprise solutions, contact our support team.",
  },
  {
    q: "Will my data be secure?",
    a: "Absolutely. We use industry-standard encryption, 24/7 monitoring, and GDPR-ready compliance for all accounts.",
  },
];

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpen(open === i ? null : i);
  };

  return (
    <section className="py-20 bg-background" id="pricing-faq">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Pricing FAQ
          </h2>
          <p className="text-muted-foreground mt-2">
            Quick answers to the most common questions about Focura’s pricing.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="border border-border rounded-xl bg-muted/40 dark:bg-muted/30 
                         backdrop-blur-sm"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-base md:text-lg font-medium text-foreground">
                  {item.q}
                </span>

                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className="px-5 pb-5 text-muted-foreground">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
