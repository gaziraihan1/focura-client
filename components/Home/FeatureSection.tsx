"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Layers, Shield } from "lucide-react";

export default function FeatureSection() {
  return (
    <section className="relative py-24 bg-background overflow-hidden">

      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          A Platform Built for Modern Teams
        </h2>

        <p className="mt-4 text-foreground/70 max-w-2xl mx-auto text-lg">
          Focura gives you all the tools you need to plan, collaborate, and ship 
          work efficiently—without the usual complexity.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <motion.div
            whileHover={{ y: -6 }}
            className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition shadow-sm hover:shadow-lg"
          >
            <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Lightning Fast</h3>
            <p className="text-foreground/70 mt-2">
              Designed for speed — experience instant interactions and seamless
              performance across your entire workflow.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition shadow-sm hover:shadow-lg"
          >
            <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center">
              <Layers className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">All-in-One Workspace</h3>
            <p className="text-foreground/70 mt-2">
              Manage tasks, docs, teams, and communication in one unified, clean
              workspace built to scale.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition shadow-sm hover:shadow-lg"
          >
            <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Secure by Default</h3>
            <p className="text-foreground/70 mt-2">
              Enterprise-grade protection ensures your data remains safe, private,
              and always accessible.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
