"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function ResourcesHero() {
  const filters = ["Guides", "Tutorials", "Blogs", "Product Updates"];

  return (
    <section className="w-full pt-32 pb-24 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-foreground"
        >
          Explore the Focura Resource Hub
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-foreground/70 mt-4 max-w-2xl mx-auto text-base md:text-lg"
        >
          Learn faster. Work smarter. Explore guides, tutorials, blogs, and product updates —
          all designed to help you scale your productivity.
        </motion.p>

        <div className="mt-10 flex justify-center">
          <div className="relative w-full max-w-xl">
  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-background px-1">
    <Search className="text-foreground/60" size={20} />
  </div>

  <input
    type="text"
    placeholder="Search resources..."
    className="
      w-full py-3 pl-12 pr-4 rounded-xl
      bg-background/60 backdrop-blur-sm
      border border-border
      text-foreground placeholder:text-foreground/50
      focus:ring-2 focus:ring-primary focus:border-primary
      transition-shadow outline-none
    "
  />
</div>

        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-7">
          {filters.map((tag) => (
            <button
              key={tag}
              className="
                px-4 py-2 rounded-full text-sm font-medium
                bg-background/50 backdrop-blur
                border border-border
                text-foreground hover:bg-primary/10 hover:text-primary
                transition-all
              "
            >
              {tag}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
