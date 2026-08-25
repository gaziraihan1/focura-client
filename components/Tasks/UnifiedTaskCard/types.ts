import { Task } from "@/hooks/useTask";

export interface TaskSectionBadge {
  name: string;
  color?: string | null;
}

export type SectionsById = ReadonlyMap<string, TaskSectionBadge>;

export type TaskCardVariant =
  | "simple"           // Basic version (components/Tasks/TaskCard.tsx)
  | "detailed"         // Rich dashboard version (components/Dashboard/AllTasks/TaskCard.tsx)
  | "project"          // Project-specific version (components/Dashboard/ProjectDetails/TaskCard.tsx)
  | "label"            // Label-specific version (components/Dashboard/Labels/LabelDetails/TaskCard.tsx)
  | "workspace"        // Workspace tasks version (components/Dashboard/AllTasks/WorkspaceTasks/TaskCard.tsx)
  | "focus"            // Focus mode version (components/Dashboard/AllTasks/FocusTaskCard.tsx)
  | "team";            // Team tasks version (components/Dashboard/TeamTask/TaskCardTeam.tsx)

export interface TaskCardProps {
  task: Task;
  variant?: TaskCardVariant;

  // Navigation props
  href?: string;
  workspaceSlug?: string;
  projectSlug?: string;

  // Animation props
  index?: number;
  enableAnimation?: boolean;

  // Display options
  showDescription?: boolean;
  showProject?: boolean;
  showAssignees?: boolean;
  showProgress?: boolean;
  showTimeTracking?: boolean;
  showEngagementCounts?: boolean;
  showStatusPill?: boolean;
  showPriorityFlag?: boolean;

  // Project-specific props
  section?: TaskSectionBadge | null;

  // Workspace-specific props
  onAddToPrimary?: (taskId: string) => void;
  onAddToSecondary?: (taskId: string) => void;
  isPrimaryDisabled?: boolean;
  showAddButtons?: boolean;
  loadingTaskId?: string | null;
  loadingType?: "primary" | "secondary" | null;
  isInPrimary?: boolean;
  isInSecondary?: boolean;

  // Focus-specific props
  timeRemaining?: number;

  // Label-specific props
  showWorkspaceMeta?: boolean;

  // Custom className
  className?: string;
}
