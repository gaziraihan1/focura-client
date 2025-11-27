"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function SolutionProblems() {
  const items = [
    {
      title: "Scattered Tools & Misalignment",
      problem:
        "Teams juggle multiple apps for tasks, communication, and planning — causing confusion and slow decision-making.",
      solution:
        "Focura centralizes tasks, communication, and planning so your entire team stays aligned inside one unified workspace.",
      img: "/images/solution-problem-1.png",
    },
    {
      title: "Slow Communication & Missing Context",
      problem:
        "Important updates get lost across chats, emails, and docs — leading to delays and repeated work.",
      solution:
        "Real-time collaboration keeps discussions, files, updates, and tasks connected to the same context.",
      img: "/images/solution-problem-2.png",
    },
    {
      title: "Inefficient Execution & No Visibility",
      problem:
        "Teams don't know who is doing what, what’s blocked, or what’s next — reducing productivity.",
      solution:
        "Focura gives you powerful progress tracking, clear ownership, and automated status indicators.",
      img: "/images/solution-problem-3.png",
    },
  ];

  return (
    <section className="relative py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Solving the biggest challenges modern teams face
          </h2>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            From planning to execution — these are the problems slowing teams
            down, and how Focura solves each one with clarity.
          </p>
        </motion.div>

        <div className="space-y-20">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="relative w-full h-[260px] md:h-[360px] rounded-3xl overflow-hidden border border-border bg-background/50 backdrop-blur-sm shadow-lg">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  {item.title}
                </h3>

                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="text-red-500" size={20} />
                    <span className="text-red-500 font-medium">The Problem</span>
                  </div>
                  <p className="text-foreground/80">{item.problem}</p>
                </div>

                <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="text-primary" size={20} />
                    <span className="text-primary font-medium">
                      How Focura Fixes It
                    </span>
                  </div>
                  <p className="text-foreground/80">{item.solution}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
