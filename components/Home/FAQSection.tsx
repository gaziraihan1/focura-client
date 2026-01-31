"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/constant/home.constant";

export default function FAQSection() {
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
          Find answers to the most common questions about Focura.
        </p>

        <div className="mt-16 space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="
                border border-border rounded-2xl
                bg-background/40 backdrop-blur-xl
                shadow-[0_0_30px_-10px_rgba(0,0,0,0.12)]
                hover:shadow-[0_0_45px_-10px_rgba(0,0,0,0.18)]
                transition-all
              "
            >
              <button
                onClick={() => toggleFAQ(i)}
                className="
                  w-full flex items-center justify-between
                  text-left p-6 md:p-7
                "
              >
                <span className="text-lg font-semibold text-foreground">
                  {faq.q}
                </span>

                <motion.div
                  animate={{
                    rotate: openIndex === i ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="text-foreground/60" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="px-6 pb-6 md:px-7 md:pb-7 text-foreground/70">
                      {faq.a}
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
