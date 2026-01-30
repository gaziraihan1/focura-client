export default function Metrics() {
  const metrics = [
    { value: "3×", label: "Faster Task Completion" },
    { value: "40%", label: "Less Context Switching" },
    { value: "2.5h", label: "Daily Time Saved" },
    { value: "95%", label: "Team Satisfaction Score" },
  ];

  return (
    <section className="py-24 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto text-center space-y-5">
        <h2 className="text-3xl md:text-4xl font-bold">
          Proven <span className="text-brand">Productivity Gains</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Teams switching to Focura experience immediate improvements in
          clarity, execution, and collaboration.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-16 px-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="p-8 backdrop-blur-lg bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl text-center shadow-[0_0_30px_-10px_rgba(0,0,0,0.3)]"
          >
            <div className="text-4xl font-bold text-brand">{m.value}</div>
            <div className="text-sm text-muted-foreground mt-2">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
