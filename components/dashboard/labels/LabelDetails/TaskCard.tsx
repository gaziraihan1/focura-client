"use client";

// Migrated to use UnifiedTaskCard for consistency
// TODO: Eventually remove this file and update imports to use UnifiedTaskCard directly
import { UnifiedTaskCard } from "@/components/tasks/unified-task-card";
import { Task } from "@/hooks/useTask";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    status: string;
    priority: string;
    // Both relations are nullable: Task.projectId / Task.workspaceId are
    // optional in the schema, and Project.workspace resolves to null for
    // legacy rows (compound FK on workspaceId + workspaceSlug).
    workspace?: {
      id: string;
      name: string;
      slug: string;
    } | null;
    project?: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  // Convert the simplified task structure to the full Task structure expected by UnifiedTaskCard
  const fullTask: Task = {
    id: task.id,
    title: task.title,
    description: "",
    status: task.status.toUpperCase().replace(" ", "_") as Task["status"],
    priority: task.priority.toUpperCase() as Task["priority"],
    dueDate: null,
    startDate: null,
    estimatedHours: undefined,
    createdBy: { id: "", name: "" },
    assignees: [],
    ...(task.project && {
      project: {
        id: task.project.id,
        slug: task.project.slug,
        name: task.project.name,
        color: "#3b82f6",
        workspace: task.workspace
          ? { id: task.workspace.id, name: task.workspace.name }
          : null,
      },
    }),
    workspaceId: task.workspace?.id,
    _count: { comments: 0, subtasks: 0, files: 0 },
    createdAt: "",
    updatedAt: "",
  };

  return (
    <UnifiedTaskCard
      task={fullTask}
      variant="label"
      showWorkspaceMeta={true}
      workspaceSlug={task.workspace?.slug}
    />
  );
}