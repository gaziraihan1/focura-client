"use client";

import React from "react";
import { LayoutGrid, Users, Zap, CheckCircle } from "lucide-react";

export default function WorkflowSteps() {
  const steps = [
    {
      title: "Plan with clarity",
      desc: "Create organized roadmaps and align your team with a clear overview.",
      icon: LayoutGrid,
    },
    {
      title: "Collaborate in real time",
      desc: "Discuss tasks, share updates, and collaborate without losing context.",
      icon: Users,
    },
    {
      title: "Execute with confidence",
      desc: "Track progress, manage tasks, and deliver work efficiently.",
      icon: Zap,
    },
    {
      title: "Review & improve",
      desc: "Refine your workflow with insights, analytics, and actionable feedback.",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="relative py-28">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          How Focura streamlines your workflow
        </h2>

        <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
          A smooth, intuitive flow that helps your team plan, collaborate, and deliver without friction.
        </p>

        <div className="relative mt-24 grid gap-24">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-foreground/10 -translate-x-1/2" />

          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <div
                key={i}
                className={`relative flex flex-col md:flex-row items-center gap-6 lg:gap-10 ${
                  i % 2 === 0 ? "md:text-left md:flex-row" : "md:flex-row-reverse md:text-right"
                }`}
              >
                <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-1/2 w-5 h-5 rounded-full bg-background border border-foreground/20 shadow-[0_0_20px_rgba(0,0,0,0.05)]" />

                <div className="relative z-10 w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-2xl 
                  bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg">
                  <Icon size={28} className="text-primary" />
                </div>

                <div className="max-w-[400px] lg:px-6">
                  <h3 className="text-2xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-foreground/70 text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
