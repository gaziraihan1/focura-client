"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FeatureFinalCTA() {
  return (
    <section className="py-28">
      <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to supercharge your workflow with{" "}
          <span className="text-brand">Focura?</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Start building a faster, more organized, and more collaborative
          workflow today.
        </p>

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

        <p className="text-xs text-muted-foreground pt-4">
          No credit card required · All features included
        </p>
      </div>
    </section>
  );
}
