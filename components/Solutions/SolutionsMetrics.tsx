"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

export default function SolutionsMetrics() {
  const metrics = [
    {
      value: 42,
      suffix: "%",
      label: "Faster project delivery",
      desc: "Teams complete tasks significantly quicker with structured workflows.",
    },
    {
      value: 3.1,
      suffix: "x",
      label: "Increase in productivity",
      desc: "Clear visibility and real-time collaboration boosts execution speed.",
    },
    {
      value: 28,
      suffix: "%",
      label: "Less time spent in meetings",
      desc: "Async updates reduce unnecessary calls and long discussions.",
    },
    {
      value: 19,
      suffix: "hrs",
      label: "Saved per team per week",
      desc: "Automation removes repetitive tasks and manual updates.",
    },
  ];

  function Counter({ value, suffix }: { value: number; suffix: string }) {
    const count = useMotionValue(0);
    const [display, setDisplay] = useState("0");

    useEffect(() => {
      const controls = animate(count, value, {
        duration: 1.4,
        ease: "easeOut",
      });

      const unsubscribe = count.on("change", (latest) => {
        setDisplay(latest.toFixed(latest % 1 === 0 ? 0 : 1));
      });

      return () => {
        unsubscribe();
        controls.stop();
      };
    }, [value, count]);

    return (
      <span>
        {display}
        {suffix}
      </span>
    );
  }

  return (
    <section className="py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Real results teams achieve with Focura
          </h2>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            Data-backed improvements showing how Focura helps teams move faster,
            stay aligned, and deliver consistently.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="
                p-7 rounded-3xl border border-border
                bg-background/40 backdrop-blur-xl shadow-sm
                hover:shadow-lg transition text-center
              "
            >
              <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <Counter value={item.value} suffix={item.suffix} />
              </h3>

              <p className="text-lg font-semibold text-foreground mb-1">
                {item.label}
              </p>

              <p className="text-sm text-foreground/60 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
