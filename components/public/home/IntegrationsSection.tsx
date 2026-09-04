import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { integrations } from "@/constants/home.constants";

export default function IntegrationsSection() {
  return (
    <section className="py-20 bg-background border-y border-border/60">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Integrations
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Works seamlessly with your tools
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Connect Gablura with your favorite apps and keep your workflow unified
          across platforms.
        </p>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted px-4 py-6 transition-colors transition-transform duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg hover:shadow-foreground/5"
            >
              {/* Grayscale + dim only applies on devices that support hover (desktop);
                  touch devices show the brand color immediately since there is no hover state. */}
              <div className="relative h-10 w-10 transition-[opacity,filter] duration-300 [@media(hover:hover)]:opacity-70 [@media(hover:hover)]:grayscale group-hover:opacity-100 group-hover:grayscale-0">
                <Image
                  src={item.logo}
                  alt={item.name}
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <p className="text-sm font-medium text-foreground">{item.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/features"
            className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            Explore All Integrations
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
