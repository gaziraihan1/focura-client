"use client";

import { motion } from "framer-motion";

export default function ResourcesFeaturedGuides() {
  const guides = [
    {
      title: "Organizing Projects the Smart Way",
      desc: "Learn how teams structure projects inside Focura for maximum clarity.",
    },
    {
      title: "Using Real-Time Collaboration",
      desc: "Keep everyone aligned using live editing, comments, and auto-sync.",
    },
    {
      title: "Setting Up Roles & Permissions",
      desc: "Control access levels and manage who can view or edit workspaces.",
    },
    {
      title: "Integrating Focura with Third-Party Apps",
      desc: "Connect your favorite tools to build a cohesive workflow.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Featured Guides
          </h2>
          <p className="mt-3 text-foreground/70 max-w-xl mx-auto">
            Step-by-step articles to help you master every part of Focura.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8">
          {guides.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4 }}
              className="
                p-6 rounded-2xl border border-border 
                bg-background/40 backdrop-blur-lg
                hover:shadow-lg transition cursor-pointer
              "
            >
              <h3 className="text-lg font-semibold text-foreground">{g.title}</h3>
              <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
                {g.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
