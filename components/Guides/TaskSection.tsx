import { TASK_STATUSES } from "@/constants/guides.constants";
import { Badge, FeatureRow, InfoCard, SectionH, StepList, Tip } from "../ui";

const STEPS = [
  {
    title: "Open a project",
    desc: "Navigate to the project where you want to create the task.",
  },
  {
    title: 'Click "New Task"',
    desc: "Opens the task form. Give the task a descriptive title so team members understand the work at a glance.",
  },
  {
    title: "Fill in task details",
    desc: "Set the status, priority, due date, and assignee. Add a description for tasks that need extra context.",
  },
  {
    title: "Save and track",
    desc: "The task appears in the project list immediately. All assigned members can see it and its updates in real time.",
  },
];

export function TasksSection() {
  return (
    <div>
      <SectionH>Creating a task</SectionH>
      <StepList steps={STEPS} />

      <SectionH>Task status types</SectionH>
      <div className="flex flex-wrap gap-2 mb-6">
        {TASK_STATUSES.map((s) => (
          <Badge key={s.label} color={s.color}>
            {s.label}
          </Badge>
        ))}
      </div>

      <SectionH>Subtasks</SectionH>
      <InfoCard icon="⤵" title="Breaking work into smaller pieces">
        Open any task and use the Subtasks section to add child items. Each subtask can be checked
        off independently, giving you a clear progress view on larger work.
      </InfoCard>

      <SectionH>Attachments &amp; comments</SectionH>
      <div className="rounded-xl border border-border overflow-hidden">
        <FeatureRow>Upload files directly to any task from the task detail view</FeatureRow>
        <FeatureRow>Leave comments to discuss progress or ask questions</FeatureRow>
        <FeatureRow>
          Mention teammates with{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">@name</code> to notify
          them in a comment
        </FeatureRow>
        <FeatureRow>Reply to specific comments to keep threads organized</FeatureRow>
      </div>

      <Tip>
        All task changes — status updates, new comments, attachments — are logged in the activity
        feed so your team always has full context.
      </Tip>
    </div>
  );
}