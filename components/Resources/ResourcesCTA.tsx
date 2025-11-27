"use client";

import { motion } from "framer-motion";

export default function ResourcesCTA() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            p-10 rounded-3xl border border-border bg-background/40 
            backdrop-blur-2xl shadow-lg text-center
          "
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Stay Updated with Focura Insights
          </h2>

          <p className="mt-3 text-foreground/70 max-w-2xl mx-auto">
            Join our monthly newsletter and get the latest guides, product updates, tutorials,
            and productivity tips directly to your inbox.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Enter your email..."
              className="
                px-4 py-3 rounded-xl bg-secondary text-foreground 
                border border-border w-full max-w-sm focus:ring-2 ring-primary outline-none 
              "
            />
            <button
              className="
                px-6 py-3 rounded-xl font-medium bg-primary text-primary-foreground 
                hover:opacity-90 transition
              "
            >
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
