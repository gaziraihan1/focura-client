"use client";

import React from "react";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Workflow,
  Clock,
  Users,
} from "lucide-react";

export default function FeaturesHighlights() {
  const highlights = [
    {
      icon: <Workflow className="text-primary" size={32} />,
      title: "Streamlined workflows",
      desc: "Organize tasks, assign team members, and keep every project flowing with clarity.",
    },
    {
      icon: <Users className="text-primary" size={32} />,
      title: "Real-time collaboration",
      desc: "Comment, discuss, and update instantly without switching tools or losing context.",
    },
    {
      icon: <ShieldCheck className="text-primary" size={32} />,
      title: "Enterprise-grade security",
      desc: "All your data is safely encrypted and protected across all devices.",
    },
    {
      icon: <Clock className="text-primary" size={32} />,
      title: "Smart scheduling",
      desc: "Plan and track timelines with intelligent scheduling and reminders.",
    },
    {
      icon: <Layers className="text-primary" size={32} />,
      title: "Modular structure",
      desc: "Use only the tools you need — drag, reorder, and customize your workspace.",
    },
    {
      icon: <Sparkles className="text-primary" size={32} />,
      title: "Automated productivity",
      desc: "Let Focura handle repetitive work with automations and smart triggers.",
    },
  ];

  return (
    <section className="relative py-28 bg-background">
      <div className="absolute -top-10 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute -bottom-10 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px] opacity-40 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Everything you need in one powerful platform
          </h2>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            Focura enhances your productivity with tools that adapt to your
            workflow and scale with your team.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="
                p-8 rounded-2xl border border-border/50 bg-background/40 backdrop-blur-xl 
                hover:shadow-2xl transition-all hover:-translate-y-1
              "
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 border border-border mb-6">
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-foreground/60 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
