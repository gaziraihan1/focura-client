import { PROJECT_VIEW_MODES } from "@/constants/guides.constants";
import { Badge, InfoCard, SectionH, StepList, Tip } from "../ui";

const STEPS = [
  {
    title: 'Click "New Project"',
    desc: "Find the button in the sidebar or the projects listing page.",
  },
  {
    title: "Fill in project details",
    desc: "Give your project a clear name. A URL-friendly slug is automatically generated and used in all links to this project.",
  },
  {
    title: "Add members",
    desc: "Assign workspace members to this project. Only assigned members will see and work on tasks within it.",
  },
];
 
export function ProjectsSection() {
  return (
    <div>
      <InfoCard icon="◈" title="What is a project?">
        Projects are containers for related tasks. Use them to group work by feature, team, sprint,
        or any category that makes sense for your workflow. Each project has its own task list,
        members, and activity history.
      </InfoCard>

      <SectionH>Creating a project</SectionH>
      <StepList steps={STEPS} />

      <SectionH>Viewing modes</SectionH>
      <div className="rounded-xl border border-border overflow-hidden mb-4">
        {PROJECT_VIEW_MODES.map(({ badge, color, desc }, i) => (
          <div
            key={badge}
            className={`flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 ${
              i < PROJECT_VIEW_MODES.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <Badge color={color}>{badge}</Badge>
            <span className="text-sm text-muted-foreground">{desc}</span>
          </div>
        ))}
      </div>

      <Tip>Use the project slug in URLs to share a direct link to any project with teammates.</Tip>
    </div>
  );
}