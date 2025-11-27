"use client";

import { motion } from "framer-motion";
import { Briefcase, Code2, PenTool, Users, Building2, Rocket } from "lucide-react";

export default function SolutionUseCases() {
  const useCases = [
    {
      icon: <Briefcase size={30} className="text-primary" />,
      title: "Project Management Teams",
      desc: "Plan, assign, track, and deliver projects with a centralized workflow everyone understands.",
    },
    {
      icon: <Code2 size={30} className="text-primary" />,
      title: "Engineering Teams",
      desc: "Break tasks into sprints, track blockers, review progress, and ship faster with clarity.",
    },
    {
      icon: <PenTool size={30} className="text-primary" />,
      title: "Creative & Marketing Teams",
      desc: "Organize assets, collaborate on ideas, and execute campaigns from one place.",
    },
    {
      icon: <Users size={30} className="text-primary" />,
      title: "Remote & Hybrid Teams",
      desc: "Keep communication aligned and ensure everyone stays productive regardless of location.",
    },
    {
      icon: <Building2 size={30} className="text-primary" />,
      title: "Agencies & Clients",
      desc: "Manage multiple clients, share updates transparently, and deliver work efficiently.",
    },
    {
      icon: <Rocket size={30} className="text-primary" />,
      title: "Startups & Founders",
      desc: "Plan features, track progress, and scale your operations without chaos.",
    },
  ];

  return (
    <section className="py-28 bg-background relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Built for every fast-moving team
          </h2>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            Whether you&apos;re a solo founder or a large organization, Focura adapts 
            to your workflow and boosts productivity at every level.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-7 rounded-3xl border border-border bg-background/40 backdrop-blur-xl shadow-sm hover:shadow-lg transition"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-5">
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-2">
                {item.title}
              </h3>

              <p className="text-foreground/70 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
