"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export default function FinalSolutionsCTA() {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-t from-primary/10 via-transparent to-primary/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-foreground"
        >
          Ready to streamline your workflow <br /> with Focura?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 text-lg text-foreground/70 max-w-2xl mx-auto"
        >
          Empower your team with modern tools built for collaboration,
          productivity, and clarity. Experience the difference starting today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link
            href="/signup"
            className="px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all flex items-center gap-2"
          >
            Get Started Free
          </Link>

          <Link
            href="/contact"
            className="
              px-8 py-4 rounded-full border border-foreground/20 
              text-foreground bg-white/5 dark:bg-black/10 
              backdrop-blur-md hover:bg-white/10 hover:dark:bg-black/20 
              transition-all shadow-sm
            "
          >
            Talk to Sales
          </Link>
        </motion.div>       
      </div>
    </section>
  );
}
