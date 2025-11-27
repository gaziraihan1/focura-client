"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

export default function SolutionsHero() {
  return (
    <section className="relative w-full py-28 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm"
        >
          Solutions for Modern Teams
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
              Designed to solve the <span className="text-primary">real</span>{" "}
              challenges teams face every day.
            </h1>

            <p className="mt-6 text-lg text-foreground/70 max-w-lg">
              From project alignment to team communication — Focura helps you
              eliminate chaos, work smarter, and deliver faster. Built for
              agencies, founders, remote teams, creators, and fast-growing
              businesses.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20"
              >
                Explore Solutions
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-7 py-3 rounded-xl border border-border font-medium text-foreground/80 backdrop-blur"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden border border-border bg-background/50 backdrop-blur-xl shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1480944657103-7fed22359e1d?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Focura dashboard preview"
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/30 blur-[70px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
