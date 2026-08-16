import Link from "next/link";
import { ArrowRight, Github, Mail, Zap } from "lucide-react";

const links = [
  {
    icon: Github,
    label: "View Source",
    sub: "focura-client on GitHub",
    href: "https://github.com/gaziraihan1/focura-client",
    variant: "secondary" as const,
  },
  {
    icon: Mail,
    label: "Get in Touch",
    sub: "focurabusiness@gmail.com",
    href: "mailto:focurabusiness@gmail.com",
    variant: "secondary" as const,
  },
];

export const AboutCTA = () => {
  return (
    <section className="border-t bg-muted/50">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="rounded-3xl border  bg-card overflow-hidden relative">
          {/* Subtle grid bg inside card */}
          {/* <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(var(--color-foreground,#171717) 1px,transparent 1px),
                linear-gradient(90deg,var(--color-foreground,#171717) 1px,transparent 1px)`,
              backgroundSize: "32px 32px",
            }} */}
          {/* /> */}

          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-muted/40 dark:bg-muted/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative px-8 py-16 md:px-14 md:py-20 text-center">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 rounded-full border  bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground inline-block animate-pulse" />
              Live on Vercel · v1.1.0 Stable
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              Ready to focus?
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
              Start a free workspace on Focura today. No credit card required.
              Full feature access from day one.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link
                href="/authentication/registration"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-6 py-3.5 text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                <Zap className="w-4 h-4 shrink-0" strokeWidth={2} />
                Start for Free
                <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={2} />
              </Link>
            </div>

            {/* Divider */}
            <div className="w-full max-w-xs mx-auto border-t border mb-10" />

            {/* Secondary links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {links.map(({ icon: Icon, label, sub, href }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-xl border  bg-muted hover:bg-muted/80 px-5 py-3 transition-colors group"
                >
                  <Icon
                    className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
                    strokeWidth={1.8}
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground leading-none">
                      {label}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                      {sub}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};