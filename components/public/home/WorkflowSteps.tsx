const steps = [
  {
    title: "Plan with clarity",
    desc: "Create organized roadmaps and align your team with a clear overview.",
  },
  {
    title: "Collaborate in real time",
    desc: "Discuss tasks, share updates, and collaborate without losing context.",
  },
  {
    title: "Execute with confidence",
    desc: "Track progress, manage tasks, and deliver work efficiently.",
  },
  {
    title: "Review & improve",
    desc: "Refine your workflow with insights, analytics, and actionable feedback.",
  },
];
export default function WorkflowSteps() {

  return (
    <section className="relative py-24 md:py-28 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          How it works
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          How Gablura streamlines your workflow
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          A smooth, intuitive flow that helps your team plan, collaborate, and
          deliver without friction.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 text-left">
          {steps.map((step, i) => (
            <div key={step.title} className="relative flex gap-5">
              <div className="flex flex-col items-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-sm font-semibold text-foreground shadow-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < steps.length - 1 && (
                  <span className="mt-2 h-full w-px bg-border" aria-hidden="true" />
                )}
              </div>
              <div className="pb-10">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
