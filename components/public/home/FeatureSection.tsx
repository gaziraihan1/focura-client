import { Zap, Layers, Shield } from "lucide-react";

const cards = [
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Designed for speed — instant interactions and seamless performance across your entire workflow.",
  },
  {
    icon: Layers,
    title: "All-in-One Workspace",
    desc: "Tasks, docs, teams, and communication in one unified, clean workspace built to scale.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    desc: "Enterprise-grade protection keeps your data safe, private, and always accessible.",
  },
];
export default function FeatureSection() {

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Why Gablura
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          A platform built for modern teams
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
          Gablura gives you all the tools you need to plan, collaborate, and ship
          work efficiently — without the usual complexity.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative p-8 rounded-2xl border border-border bg-card transition-colors transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5"
            >
              <div className="w-14 h-14 mb-6 rounded-xl bg-muted flex items-center justify-center transition-colors group-hover:bg-foreground">
                <Icon className="w-7 h-7 text-foreground transition-colors group-hover:text-background" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
              <p className="text-muted-foreground mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
