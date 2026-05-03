import { COLOR_MAP } from "@/constants/guides.constants";
import { FeatureList, InfoCard, SectionH, StepList, Tip } from "../ui";

// ── Labels ────────────────────────────────────────────────────────────────────

const LABEL_CREATE_STEPS = [
  {
    title: "Open a project",
    desc: "Labels are created and managed per project. Navigate to the project where you want to add a label.",
  },
  {
    title: "Go to Labels settings",
    desc: "Find the Labels option in the project settings or task filter panel.",
  },
  {
    title: "Create a new label",
    desc: 'Enter a name for the label and pick a color. Use short, descriptive names like "Bug", "Design", "Urgent", or "Backend".',
  },
  {
    title: "Apply labels to tasks",
    desc: "Open any task and use the Labels field to attach one or more labels. A task can have multiple labels at once.",
  },
];

const LABEL_TIPS = [
  "Use consistent label names across projects so filtering feels predictable",
  "Color-code by category — e.g. red for bugs, blue for features, yellow for design",
  "Labels work alongside status and priority — use them for dimensions those fields don't cover",
  "Filter the task list by label to quickly scope work to a specific area",
];

const LABEL_EXAMPLES = [
  { name: "Bug", color: "rose", desc: "Something is broken and needs fixing" },
  { name: "Feature", color: "blue", desc: "New functionality being built" },
  { name: "Design", color: "violet", desc: "Involves UI or visual work" },
  { name: "Backend", color: "slate", desc: "Server-side or API work" },
  { name: "Urgent", color: "amber", desc: "Needs immediate attention" },
  { name: "Docs", color: "teal", desc: "Documentation or copy updates" },
];


export function LabelsSection() {
  return (
    <div>
      <InfoCard icon="🏷️" title="What are labels?">
        Labels are colored tags you attach to tasks to categorize them beyond status and priority.
        Use labels to mark work by type, team, area of the codebase, or any custom dimension that
        matters to your workflow.
      </InfoCard>

      <SectionH>Creating and applying labels</SectionH>
      <StepList steps={LABEL_CREATE_STEPS} />

      <SectionH>Label ideas to get you started</SectionH>
      <div className="rounded-xl border border-border overflow-hidden mb-4">
        {LABEL_EXAMPLES.map(({ name, color, desc }, i) => {
          const c = COLOR_MAP[color];
          return (
            <div
              key={name}
              className={`flex items-center gap-3 px-4 py-3 ${
                i < LABEL_EXAMPLES.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold shrink-0 ${c.pill}`}>
                {name}
              </span>
              <span className="text-sm text-muted-foreground">{desc}</span>
            </div>
          );
        })}
      </div>

      <SectionH>Best practices</SectionH>
      <FeatureList items={LABEL_TIPS} />

      <Tip>
        Keep your label list focused — too many labels makes filtering noisy. Aim for 5–10 labels
        per project that your team actually uses consistently.
      </Tip>
    </div>
  );
}
