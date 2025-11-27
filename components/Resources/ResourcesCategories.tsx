"use client";

import { motion } from "framer-motion";
import { Folder, BookOpen, Lightbulb, Cpu } from "lucide-react";

export default function ResourcesCategories() {
  const categories = [
    {
      icon: Folder,
      title: "Project Management",
      desc: "Learn how to structure tasks, flows and teams using Focura.",
    },
    {
      icon: BookOpen,
      title: "Getting Started",
      desc: "Everything new users need to learn about onboarding.",
    },
    {
      icon: Lightbulb,
      title: "Productivity Tips",
      desc: "Level up your workflow with expert insights and shortcuts.",
    },
    {
      icon: Cpu,
      title: "Integrations",
      desc: "Connect third-party tools and automate your workflow.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Browse by Categories
          </h2>
          <p className="mt-3 text-foreground/70 max-w-xl mx-auto">
            Quickly find content organized by themes and skill areas.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.4 }}
              className="
                p-6 rounded-2xl border border-border bg-background/40 
                backdrop-blur-xl hover:shadow-lg transition cursor-pointer
              "
            >
              <cat.icon className="w-8 h-8 text-primary" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {cat.title}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed mt-1">
                {cat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
