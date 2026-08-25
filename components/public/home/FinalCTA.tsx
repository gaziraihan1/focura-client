import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="w-full py-24 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-border bg-card px-8 py-16 text-center text-foreground md:px-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl leading-tight">
              Boost Your Productivity —
              <br />
              <span className="text-muted-foreground">Start Working Smarter Today</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-muted-foreground md:text-lg">
              Join thousands of professionals who trust Focura to streamline
              tasks, organize projects, and scale with confidence.
            </p>

            <div className="mt-10">
              <Link
                href="https://focura-waitlist.web.app"
                className="group inline-flex items-center gap-2 rounded-lg bg-foreground px-8 py-4 text-sm font-semibold text-background shadow-lg transition hover:opacity-90"
              >
                Join The Waitlist
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
