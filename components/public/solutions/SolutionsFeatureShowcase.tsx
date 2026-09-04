"use client";

import type { ComponentType } from "react";
import { m as motion } from "framer-motion";
import { AutomationMock, ThreadMock, WorkflowMock } from "./SolutionMocks";

interface ShowcaseFeature {
  title: string;
  desc: string;
  Mock: ComponentType<{ showSidebar?: boolean }>;
  mockProps?: { showSidebar?: boolean };
}

const features: ShowcaseFeature[] = [
  {
    title: "Automated Task Routing",
    desc: "No more manual tracking — tasks intelligently flow between teams with rules, triggers, and approvals.",
    Mock: AutomationMock,
  },
  {
    title: "Custom Workflows for Every Team",
    desc: "Marketing, HR, IT, Operations — each team gets custom pipelines without writing code.",
    Mock: WorkflowMock,
  },
  {
    title: "Collaboration Without Chaos",
    desc: "Real-time updates, comments, timelines, files — everything stays organized in one place.",
    Mock: ThreadMock,
    // Inside the 3-column feature grid each card is only ~300px wide, so the
    // thread mock renders without its fixed-width sidebar to stay readable.
    mockProps: { showSidebar: false },
  },
];

export default function SolutionsFeatureShowcase() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Powerful Features That Fit Your Workflow
          </h2>
          <p className="mt-4 text-foreground/70">
            Gablura adapts to your business — not the other way around.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {features.map((feature, i) => {
            const { Mock, mockProps } = feature;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5"
              >
                <Mock {...(mockProps ?? {})} />

                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
