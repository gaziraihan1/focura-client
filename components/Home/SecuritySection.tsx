"use client";

import React from "react";
import { ShieldCheck, Lock, KeyRound, Server } from "lucide-react";
import { motion } from "framer-motion";

export default function SecuritySection() {
  const items = [
    {
      icon: <ShieldCheck size={32} className="text-primary" />,
      title: "Enterprise-grade protection",
      desc: "Focura uses industry-standard encryption and zero-trust principles to keep your data secure.",
    },
    {
      icon: <Lock size={32} className="text-primary" />,
      title: "End-to-end encryption",
      desc: "All data is encrypted in transit and at rest using modern cryptographic standards.",
    },
    {
      icon: <Server size={32} className="text-primary" />,
      title: "Secure cloud infrastructure",
      desc: "Hosted on globally distributed, fault-tolerant cloud infrastructure with 99.9% uptime.",
    },
    {
      icon: <KeyRound size={32} className="text-primary" />,
      title: "Role-based access control",
      desc: "Granular permission levels ensure only the right people can access sensitive information.",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Security you can rely on
        </h2>

        <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
          Built with the highest security standards to keep your workflow, data, and team safe — always.
        </p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="
                p-8 rounded-2xl border border-border
                bg-background/40 backdrop-blur-xl
                shadow-[0_0_30px_-10px_rgba(0,0,0,0.12)]
                hover:shadow-[0_0_45px_-10px_rgba(0,0,0,0.18)]
                transition-all
              "
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                {item.icon}
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                {item.title}
              </h3>

              <p className="mt-2 text-foreground/60">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
