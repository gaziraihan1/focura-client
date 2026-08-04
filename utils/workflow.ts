import type { ProjectSectionItem } from "@/hooks/useProjectFeatures";

export interface WorkflowColumn {
  status: NonNullable<ProjectSectionItem["taskStatus"]>;
  label: string;
  color: string;
  sectionId: string;
}

/**
 * Maps a project's workflow sections to Kanban board columns.
 *
 * Membership is status-driven: each ACTIVE section that has a `taskStatus`
 * becomes one column, ordered by `position`. Returns `null` when there are
 * no usable sections so callers can fall back to the static default columns
 * (existing projects that predate workflows).
 */
export function buildWorkflowColumns(
  sections: ProjectSectionItem[],
): WorkflowColumn[] | null {
  const columns = sections
    .filter(
      (
        section,
      ): section is ProjectSectionItem & {
        taskStatus: NonNullable<ProjectSectionItem["taskStatus"]>;
      } => section.status === "ACTIVE" && !!section.taskStatus,
    )
    .sort((a, b) => a.position - b.position)
    .map((section) => ({
      status: section.taskStatus,
      label: section.name,
      color: section.color ?? "#667eea",
      sectionId: section.id,
    }));

  return columns.length > 0 ? columns : null;
}

/**
 * Combines workflow columns with default columns so every default status
 * still has a column on the board. This keeps tasks visible: a task whose
 * status has no mapped section still lands in its default column instead of
 * disappearing from the board (default statuses = the static board's columns).
 */
export function mergeBoardColumns<T extends { status: string }>(
  workflow: WorkflowColumn[] | null,
  defaults: T[],
): (WorkflowColumn | T)[] {
  if (!workflow) return defaults;
  const mappedStatuses = new Set<string>(workflow.map((column) => column.status));
  return [...workflow, ...defaults.filter((column) => !mappedStatuses.has(column.status))];
}

/**
 * Groups tasks into board columns with section precedence.
 *
 * A task explicitly assigned to a workflow section (`sectionId` matching a
 * column) appears only in that column — never duplicated in its status
 * column too. Unassigned tasks are placed by their status. Tasks whose
 * `sectionId` no longer matches any column fall back to status matching.
 */
export function assignTasksToColumns<T extends { status: string; sectionId?: string | null }>(
  columns: Array<{ status: string; sectionId?: string }>,
  tasks: T[],
): Map<string, T[]> {
  const workflowSectionIds = new Set<string>(
    columns.map((column) => column.sectionId).filter((id): id is string => !!id),
  );
  const result = new Map<string, T[]>();

  for (const column of columns) {
    result.set(
      column.status,
      tasks.filter((task) => {
        if (task.sectionId && workflowSectionIds.has(task.sectionId)) {
          return column.sectionId != null && task.sectionId === column.sectionId;
        }
        return task.status === column.status;
      }),
    );
  }

  return result;
}
