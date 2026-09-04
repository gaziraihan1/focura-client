"use client";

import { m as motion } from "framer-motion";
import { KanbanMock } from "./SolutionMocks";

export default function SolutionsHero() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/5 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
        >
          Solutions for Modern Teams
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl xl:text-6xl">
              Designed to solve the <span className="text-primary">real</span>{" "}
              challenges teams face every day.
            </h1>

            <p className="mt-6 max-w-lg text-base text-foreground/70 sm:text-lg">
              From project alignment to team communication — Gablura helps you
              eliminate chaos, work smarter, and deliver faster. Built for
              agencies, founders, remote teams, creators, and fast-growing
              businesses.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <motion.a
                href="/features"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center rounded-xl bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20"
              >
                Explore Solutions
              </motion.a>

              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center rounded-xl border border-border px-7 py-3 font-medium text-foreground/80 backdrop-blur"
              >
                Watch Demo
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
            aria-hidden="true"
          >
            <KanbanMock
              project="Northwind — Q3 Roadmap"
              sub="Product · 4 members"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
