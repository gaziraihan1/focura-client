"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "Automated Task Routing",
    desc: "No more manual tracking — tasks intelligently flow between teams with rules, triggers, and approvals.",
    img: "/images/solutions/auto-routing.png",
  },
  {
    title: "Custom Workflows for Every Team",
    desc: "Marketing, HR, IT, Operations — each team gets custom pipelines without writing code.",
    img: "/images/solutions/workflow-maker.png",
  },
  {
    title: "Collaboration Without Chaos",
    desc: "Real-time updates, comments, timelines, files — everything stays organized in one place.",
    img: "/images/solutions/collab.png",
  },
];

export default function SolutionsFeatureShowcase() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Powerful Features That Fit Your Workflow
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Focura adapts to your business — not the other way around.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 
                         backdrop-blur-xl shadow-lg border border-white/20 
                         hover:shadow-xl transition-all duration-300"
            >
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6">
                <Image
                  src={feature.img}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
