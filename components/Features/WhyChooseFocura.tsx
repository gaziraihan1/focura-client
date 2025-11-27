"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Workflow,
  Gauge,
  Users,
  CloudLightning,
} from "lucide-react";

export default function WhyChooseFocura() {
  const reasons = [
    {
      title: "Lightning-fast workflow",
      desc: "Experience real-time updates, instant sync, and ultra-smooth navigation across all your work.",
      icon: <Gauge size={34} className="text-primary" />,
    },
    {
      title: "Effortless collaboration",
      desc: "Bring teams together with comments, mentions, shared boards, and unified communication.",
      icon: <Users size={34} className="text-primary" />,
    },
    {
      title: "Built for clarity",
      desc: "Everything stays clean, structured, and easy to understand — even as your team grows.",
      icon: <Workflow size={34} className="text-primary" />,
    },
    {
      title: "Secure by default",
      desc: "Enterprise-grade security, encryption, and safe data handling built in from day one.",
      icon: <ShieldCheck size={34} className="text-primary" />,
    },
    {
      title: "Smart automation",
      desc: "Automate repetitive tasks and let your team focus on what truly matters.",
      icon: <CloudLightning size={34} className="text-primary" />,
    },
    {
      title: "A beautiful experience",
      desc: "A modern interface your team will *actually* enjoy using — fast, clean, and aesthetic.",
      icon: <Sparkles size={34} className="text-primary" />,
    },
  ];

  return (
    <section className="relative w-full py-28">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Why teams choose <span className="text-primary">Focura</span>
          </h2>
          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto">
            A platform crafted to help modern teams move faster, stay aligned, 
            and build high-impact work with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="
                backdrop-blur-xl bg-background/40 
                border border-border/40 
                shadow-[0_0_25px_-10px_var(--border)]
                rounded-2xl p-8 flex flex-col items-start 
                hover:shadow-lg hover:bg-background/50 
                transition-all duration-300
              "
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 border border-border/50">
                {r.icon}
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-2">
                {r.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
