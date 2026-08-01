"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FeatureFinalCTA() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-5xl space-y-6 px-4 text-center">
        <h2 className="text-4xl font-bold md:text-5xl">
          Ready to supercharge your workflow with{" "}
          <span className="text-primary">Focura?</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Start building a faster, more organized, and more collaborative
          workflow today.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <Link
            href="/signup"
            className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-lg font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            Get Started Free
          </Link>

          <Link
            href="/contact"
            className="rounded-xl border border-border bg-card px-7 py-3 text-lg font-semibold text-foreground shadow-sm transition-all hover:bg-muted"
          >
            Talk to Sales
          </Link>
        </motion.div>

        <p className="pt-4 text-xs text-muted-foreground">
          No credit card required · All features included
        </p>
      </div>
    </section>
  );
}
