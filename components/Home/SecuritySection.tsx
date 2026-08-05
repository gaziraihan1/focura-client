import { ShieldCheck, Lock, KeyRound, Server } from "lucide-react";

export default function SecuritySection() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Enterprise-grade protection",
      desc: "Focura uses industry-standard encryption and zero-trust principles to keep your data secure.",
    },
    {
      icon: Lock,
      title: "End-to-end encryption",
      desc: "All data is encrypted in transit and at rest using modern cryptographic standards.",
    },
    {
      icon: Server,
      title: "Secure cloud infrastructure",
      desc: "Hosted on globally distributed, fault-tolerant cloud infrastructure with 99.9% uptime.",
    },
    {
      icon: KeyRound,
      title: "Role-based access control",
      desc: "Granular permission levels ensure only the right people can access sensitive information.",
    },
  ];

  return (
    <section className="relative py-24 md:py-28 bg-background border-t border-border/60">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Security
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Security you can rely on
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Built with the highest security standards to keep your workflow, data,
          and team safe — always.
        </p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-7 text-left transition-colors transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-foreground">
                <Icon size={22} className="text-foreground transition-colors group-hover:text-background" />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
