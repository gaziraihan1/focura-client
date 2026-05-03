
// ── Activity Tracking ─────────────────────────────────────────────────────────

import { FeatureList, InfoCard, SectionH, Tip } from "../ui";

const ACTIVITY_EVENTS = [
  { event: "Task created", desc: "Who created the task and when" },
  { event: "Status changed", desc: "Every status transition with a timestamp" },
  { event: "Assignee updated", desc: "Who was assigned or unassigned" },
  { event: "Comment added", desc: "The comment author and a preview" },
  { event: "Attachment uploaded", desc: "File name and who uploaded it" },
  { event: "Subtask completed", desc: "Which subtask was checked off and by whom" },
  { event: "Label applied / removed", desc: "Label changes with author" },
  { event: "Due date changed", desc: "Old and new due date side by side" },
];

const ACTIVITY_FEATURES = [
  "The workspace activity feed shows actions across all projects in one place",
  "Each task has its own activity timeline scoped to just that task",
  "Activity entries are timestamped and attributed to the exact team member",
  "Owners and Admins can view activity for all members in Workspace Mode",
  "Activity is permanent — entries are never deleted even if the task is edited",
];

export function ActivitySection() {
  return (
    <div>
      <InfoCard icon="⚡" title="What is activity tracking?">
        Focura automatically logs every meaningful action taken on tasks, projects, and workspace
        settings. This gives your team a transparent, permanent record of how work evolves over time
        — no need to ask &quot;what changed?&quot; or &quot;who did this?&quot;.
      </InfoCard>

      <SectionH>What gets tracked</SectionH>
      <div className="rounded-xl border border-border overflow-hidden mb-4">
        {ACTIVITY_EVENTS.map(({ event, desc }, i) => (
          <div
            key={event}
            className={`flex items-start gap-3 px-4 py-3 ${
              i < ACTIVITY_EVENTS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="text-xs font-mono text-muted-foreground w-40 shrink-0 mt-0.5">
              {event}
            </span>
            <span className="text-sm text-muted-foreground">{desc}</span>
          </div>
        ))}
      </div>

      <SectionH>Where to find activity</SectionH>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <InfoCard icon="📋" title="Task activity feed">
          Open any task and scroll to the Activity section at the bottom. You&apos;ll see a
          chronological timeline of everything that&apos;s happened on that specific task.
        </InfoCard>
        <InfoCard icon="🏢" title="Workspace activity feed">
          Go to the workspace dashboard to see a combined activity stream across all projects and
          members — useful for a daily standup overview.
        </InfoCard>
      </div>

      <SectionH>Activity feed features</SectionH>
      <FeatureList
       items={ACTIVITY_FEATURES} />

      <Tip>
        Use the workspace activity feed at the start of your day to catch up on what your team
        worked on — it&apos;s faster than checking each project individually.
      </Tip>

      <SectionH>Daily Active Users (DAU)</SectionH>
      <InfoCard icon="📊" title="Workspace usage analytics">
        Owners and Admins can view DAU analytics in the Admin dashboard. This shows how many team
        members are actively engaging with the workspace each day, helping you spot quieter periods
        or onboarding gaps.
      </InfoCard>
    </div>
  );
}