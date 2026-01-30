"use client";

import { motion } from "framer-motion";
import Image from "next/image";
type Items = {
  title: string;
  desc: string;
  category: string;
  image: string;
};

export default function ResourcesPopular() {
  const items: Items[] = [
    {
      title: "Getting Started with Focura",
      desc: "A simple guide to help new teams onboard quickly and understand the workflow structure.",
      category: "Guide",
      image: "/resources/getting-started.png",
    },
    {
      title: "Boost Productivity with Workflow Automation",
      desc: "Learn how automation removes repetitive steps and keeps your team aligned.",
      category: "Tutorial",
      image: "/resources/automation.png",
    },
    {
      title: "Focura v1.4 Product Update",
      desc: "New improvements, bug fixes, and UX upgrades to make your workspace smoother.",
      category: "Product Update",
      image: "/resources/update.png",
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
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Popular Resources
          </h2>
          <p className="mt-3 text-foreground/70 max-w-xl mx-auto">
            Hand-picked resources that help you get the most out of Focura.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4 }}
              className="
                rounded-2xl border border-border bg-background/40
                shadow-sm hover:shadow-lg backdrop-blur-md p-5
                transition-all cursor-pointer
              "
            >
              <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {item.category}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-foreground/60 mt-1 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
