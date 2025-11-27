"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductShowcase() {
  return (
    <section className="relative py-28 bg-background overflow-hidden">

      <div className="absolute top-0 left-0 right-0 -translate-y-1/2">
        <svg
          viewBox="0 0 1440 160"
          fill="currentColor"
          className="w-full text-background"
        >
          <path d="M0,80 C360,160 1080,0 1440,80 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-primary/20 blur-[140px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          See your team’s work come alive
        </h2>

        <p className="mt-4 text-foreground/70 max-w-2xl mx-auto text-lg">
          Focura brings clarity to your workflow with a beautifully designed
          dashboard that gives you instant visibility across projects, tasks,
          and team communication.
        </p>

        <div className="relative mt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-border shadow-2xl bg-card"
          >
            <Image
              src="/mockups/dashboard.png"
              alt="Product dashboard mockup"
              width={1400}
              height={800}
              className="w-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="absolute -left-10 top-1/2 -translate-y-1/2 hidden md:block"
          >
            <div className="p-4 rounded-xl bg-card border border-border shadow-lg backdrop-blur">
              <p className="text-sm font-semibold text-foreground">Task Progress</p>
              <div className="mt-2 h-2 w-40 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary w-3/4"></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, y: -20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="absolute -right-10 top-1/3 hidden md:block"
          >
            <div className="p-4 rounded-xl bg-card border border-border shadow-lg backdrop-blur">
              <p className="text-sm font-semibold text-foreground">Team Activity</p>
              <ul className="text-xs mt-2 text-foreground/70">
                <li>• Alan updated a task</li>
                <li>• Sofia added a comment</li>
                <li>• Ben completed a milestone</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
        <svg
          viewBox="0 0 1440 160"
          fill="currentColor"
          className="w-full text-background"
        >
          <path d="M0,80 C360,0 1080,160 1440,80 L1440,160 L0,160 Z" />
        </svg>
      </div>
    </section>
  );
}
