"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { KanbanMock, ProgressMock, ThreadMock } from "./SolutionMocks";

export default function SolutionProblems() {
  const items = [
    {
      title: "Scattered Tools & Misalignment",
      problem:
        "Teams juggle multiple apps for tasks, communication, and planning — causing confusion and slow decision-making.",
      solution:
        "Focura centralizes tasks, communication, and planning so your entire team stays aligned inside one unified workspace.",
      Mock: KanbanMock,
      mockProps: { project: "Northwind — Q3 Roadmap", sub: "Product · 4 members" },
    },
    {
      title: "Slow Communication & Missing Context",
      problem:
        "Important updates get lost across chats, emails, and docs — leading to delays and repeated work.",
      solution:
        "Real-time collaboration keeps discussions, files, updates, and tasks connected to the same context.",
      Mock: ThreadMock,
      mockProps: { task: "Launch mobile app", status: "In Review" },
    },
    {
      title: "Inefficient Execution & No Visibility",
      problem:
        "Teams don't know who is doing what, what's blocked, or what's next — reducing productivity.",
      solution:
        "Focura gives you powerful progress tracking, clear ownership, and automated status indicators.",
      Mock: ProgressMock,
      mockProps: {},
    },
  ];

  return (
    <section className="relative bg-background py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center sm:mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            Solving the biggest challenges modern teams face
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/70 sm:text-lg">
            From planning to execution — these are the problems slowing teams
            down, and how Focura solves each one with clarity.
          </p>
        </motion.div>

        <div className="space-y-16 sm:space-y-20">
          {items.map((item, i) => {
            const { Mock, mockProps } = item;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14"
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <Mock {...mockProps} />
                </div>

                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="mb-6 text-2xl font-semibold text-foreground md:text-3xl">
                    {item.title}
                  </h3>

                  <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 sm:p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <AlertTriangle className="text-red-500" size={20} />
                      <span className="font-medium text-red-500">
                        The Problem
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
                      {item.problem}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5 sm:p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <CheckCircle2 className="text-primary" size={20} />
                      <span className="font-medium text-primary">
                        How Focura Fixes It
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
