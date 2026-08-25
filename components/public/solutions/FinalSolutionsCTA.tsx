"use client";

import { m as motion } from "framer-motion";
import Link from "next/link";

export default function FinalSolutionsCTA() {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/10 via-transparent to-primary/5" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-foreground md:text-5xl"
        >
          Ready to streamline your workflow <br className="hidden sm:block" />{" "}
          with Focura?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-base text-foreground/70 sm:text-lg"
        >
          Empower your team with modern tools built for collaboration,
          productivity, and clarity. Experience the difference starting today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
        >
          <Link
            href="/authentication/registration"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
          >
            Get Started Free
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-7 py-3 font-medium text-foreground shadow-sm transition-colors hover:bg-card/70"
          >
            Talk to Sales
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
