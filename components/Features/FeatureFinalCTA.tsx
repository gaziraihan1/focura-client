import Link from "next/link";

export default function FeatureFinalCTA() {
  return (
    <section className="py-28">
      <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to supercharge your workflow with{" "}
          <span className="text-brand">Focura?</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Start building a faster, more organized, and more collaborative workflow today.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link
            href="/signup"
className="px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all flex items-center gap-2"          >
            Start Free
          </Link>

          <Link
            href="/contact"
 className="px-7 py-3 rounded-xl border border-border/60 text-foreground font-semibold text-lg hover:bg-foreground/5 transition-all backdrop-blur-md"          >
            Talk to Sales
          </Link>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          No credit card required · All features included
        </p>
      </div>
    </section>
  );
}
