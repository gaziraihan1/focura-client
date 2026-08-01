import { metrics } from "@/constants/features.constants";

export default function Metrics() {
  return (
    <section className="py-24 bg-muted/30 dark:bg-muted/10">
      <div className="mx-auto max-w-7xl space-y-5 px-6 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Proven <span className="text-primary">Productivity Gains</span>
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Teams switching to Focura experience immediate improvements in
          clarity, execution, and collaboration.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 px-6 sm:grid-cols-2 md:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5"
          >
            <div className="text-4xl font-bold text-primary">{m.value}</div>
            <div className="mt-2 text-sm text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
