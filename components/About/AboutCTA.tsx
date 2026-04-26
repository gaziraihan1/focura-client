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
    <section className="border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden relative">
          {/* Subtle grid bg inside card */}
          <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(var(--color-neutral-900,#171717) 1px,transparent 1px),
                linear-gradient(90deg,var(--color-neutral-900,#171717) 1px,transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-neutral-200/40 dark:bg-neutral-700/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative px-8 py-16 md:px-14 md:py-20 text-center">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 px-4 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Live on Vercel · v1.0.0 Stable
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4 leading-tight">
              Ready to focus?
            </h2>
            <p className="text-base text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed mb-10">
              Start a free workspace on Focura today. No credit card required.
              Full feature access from day one.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link
                href="https://focura-client.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-xl px-6 py-3.5 text-sm font-bold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
              >
                <Zap className="w-4 h-4 shrink-0" strokeWidth={2} />
                Start for Free
                <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={2} />
              </Link>
            </div>

            {/* Divider */}
            <div className="w-full max-w-xs mx-auto border-t border-neutral-100 dark:border-neutral-800 mb-10" />

            {/* Secondary links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {links.map(({ icon: Icon, label, sub, href }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-5 py-3 transition-colors group"
                >
                  <Icon
                    className="w-4 h-4 shrink-0 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors"
                    strokeWidth={1.8}
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 leading-none">
                      {label}
                    </p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5 font-mono">
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