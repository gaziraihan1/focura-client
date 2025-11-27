"use client";

import { motion } from "framer-motion";

export default function ResourcesUpdates() {
  const updates = [
    {
      version: "v1.4",
      title: "Workspace Performance Boost",
      desc: "UI improvements, faster load times, and smoother collaboration.",
      date: "Oct 2025",
    },
    {
      version: "v1.3",
      title: "New Automation Triggers",
      desc: "Easily set condition-based triggers across your workflows.",
      date: "Aug 2025",
    },
    {
      version: "v1.2",
      title: "Improved Role Permissions",
      desc: "More granular access control for teams and organizations.",
      date: "Jun 2025",
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
            Latest Product Updates
          </h2>
          <p className="mt-3 text-foreground/70 max-w-xl mx-auto">
            Stay informed about new features, improvements, and enhancements.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {updates.map((u, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.4 }}
              className="
                p-6 rounded-2xl border border-border bg-background/40
                hover:shadow-lg backdrop-blur-md transition cursor-pointer
              "
            >
              <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                {u.version}
              </span>

              <h3 className="mt-3 text-lg font-semibold text-foreground">
                {u.title}
              </h3>

              <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
                {u.desc}
              </p>

              <p className="mt-4 text-xs text-foreground/50">{u.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
