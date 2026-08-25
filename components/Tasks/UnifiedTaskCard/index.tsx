"use client";

import { useParams } from "next/navigation";
import { calculateTimeProgress } from "@/utils/taskcard.utils";
import type { TaskCardProps } from "./types";
import { SimpleTaskCard } from "./variants/SimpleTaskCard";
import { DetailedTaskCard } from "./variants/DetailedTaskCard";
import { ProjectTaskCard } from "./variants/ProjectTaskCard";
import { LabelTaskCard } from "./variants/LabelTaskCard";
import { WorkspaceTaskCard } from "./variants/WorkspaceTaskCard";
import { FocusTaskCard } from "./variants/FocusTaskCard";
import { TeamTaskCard } from "./variants/TeamTaskCard";

export type {
  TaskSectionBadge,
  SectionsById,
  TaskCardVariant,
  TaskCardProps,
} from "./types";

/**
 * Unified task card dispatcher.
 *
 * Each visual variant lives in its own file under ./variants; this component
 * only resolves shared concerns (target href, slug fallbacks, progress,
 * workspace add-button state) and delegates rendering.
 */
export function UnifiedTaskCard({
  task,
  variant = "detailed",
  href,
  workspaceSlug,
  projectSlug,
  index = 0,
  enableAnimation = true,
  showDescription = true,
  showProject = true,
  showAssignees = true,
  showProgress = true,
  showTimeTracking = true,
  showEngagementCounts = true,
  showStatusPill = true,
  showPriorityFlag = true,
  section,
  onAddToPrimary,
  onAddToSecondary,
  isPrimaryDisabled = false,
  showAddButtons = false,
  loadingTaskId,
  loadingType,
  isInPrimary = false,
  isInSecondary = false,
  timeRemaining,
  showWorkspaceMeta = true,
  className = "",
}: TaskCardProps) {
  const params = useParams();
  const resolvedProjectSlug = projectSlug || (params.projectSlug as string);
  const resolvedWorkspaceSlug = workspaceSlug || (params.workspaceSlug as string);

  const isCompleted = task.status === "COMPLETED";

  // Calculate progress
  const progress = showProgress && task.timeTracking?.timeProgress != null
    ? Math.min(100, task.timeTracking.timeProgress)
    : (showProgress ? calculateTimeProgress(task.startDate ?? undefined, task.dueDate, task.estimatedHours) : null);

  // Determine href based on variant
  const getHref = () => {
    if (href) return href;
    if (variant === "simple") return `/tasks/${task.id}`;
    if (variant === "detailed" || variant === "focus" || variant === "team") return `/dashboard/tasks/${task.id}`;
    if (variant === "project" || variant === "workspace") {
      return `/dashboard/workspaces/${resolvedWorkspaceSlug}/projects/${task.project?.slug || resolvedProjectSlug}/tasks/${task.id}`;
    }
    if (variant === "label") {
      // Task.project.workspace carries only {id, name}; the workspace slug
      // can only come from the route param or the explicit prop.
      return `/dashboard/workspaces/${resolvedWorkspaceSlug}/projects/${task.project?.slug}/tasks/${task.id}`;
    }
    return `/dashboard/tasks/${task.id}`;
  };

  const cardHref = getHref();

  // Workspace button logic
  const showButtons = showAddButtons && !isCompleted;
  const isThisCardLoading = loadingTaskId === task.id;
  const isPrimaryLoading = isThisCardLoading && loadingType === "primary";
  const isSecondaryLoading = isThisCardLoading && loadingType === "secondary";
  const isAnyLoading = !!loadingTaskId;
  const primaryDisabled = isPrimaryDisabled || isInPrimary || isAnyLoading;
  const secondaryDisabled = isInSecondary || isAnyLoading;

  const handlePrimaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToPrimary && !isPrimaryDisabled && !isAnyLoading) {
      onAddToPrimary(task.id);
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToSecondary && !isAnyLoading) {
      onAddToSecondary(task.id);
    }
  };

  switch (variant) {
    case "simple":
      return (
        <SimpleTaskCard
          task={task}
          cardHref={cardHref}
          showProject={showProject}
          className={className}
        />
      );
    case "project":
      return (
        <ProjectTaskCard
          task={task}
          cardHref={cardHref}
          section={section}
          showAssignees={showAssignees}
          showEngagementCounts={showEngagementCounts}
          className={className}
        />
      );
    case "label":
      return (
        <LabelTaskCard
          task={task}
          cardHref={cardHref}
          showWorkspaceMeta={showWorkspaceMeta}
          className={className}
        />
      );
    case "workspace":
      return (
        <WorkspaceTaskCard
          task={task}
          cardHref={cardHref}
          isCompleted={isCompleted}
          progress={progress}
          showDescription={showDescription}
          showProject={showProject}
          showAssignees={showAssignees}
          showTimeTracking={showTimeTracking}
          showEngagementCounts={showEngagementCounts}
          showStatusPill={showStatusPill}
          showPriorityFlag={showPriorityFlag}
          className={className}
          showButtons={showButtons}
          onPrimaryClick={handlePrimaryClick}
          onSecondaryClick={handleSecondaryClick}
          primaryDisabled={primaryDisabled}
          secondaryDisabled={secondaryDisabled}
          isPrimaryLoading={isPrimaryLoading}
          isSecondaryLoading={isSecondaryLoading}
          isPrimaryDisabled={isPrimaryDisabled}
          isInPrimary={isInPrimary}
          isInSecondary={isInSecondary}
        />
      );
    case "focus":
      return (
        <FocusTaskCard
          task={task}
          cardHref={cardHref}
          isCompleted={isCompleted}
          progress={progress}
          timeRemaining={timeRemaining}
          enableAnimation={enableAnimation}
          showDescription={showDescription}
          showPriorityFlag={showPriorityFlag}
          showProject={showProject}
          showTimeTracking={showTimeTracking}
        />
      );
    case "team":
      return (
        <TeamTaskCard
          task={task}
          cardHref={cardHref}
          isCompleted={isCompleted}
          index={index}
          enableAnimation={enableAnimation}
          showDescription={showDescription}
          showProject={showProject}
          showTimeTracking={showTimeTracking}
          showStatusPill={showStatusPill}
          showPriorityFlag={showPriorityFlag}
        />
      );
    case "detailed":
    default:
      return (
        <DetailedTaskCard
          task={task}
          cardHref={cardHref}
          isCompleted={isCompleted}
          progress={progress}
          index={index}
          enableAnimation={enableAnimation}
          showDescription={showDescription}
          showProject={showProject}
          showAssignees={showAssignees}
          showTimeTracking={showTimeTracking}
          showEngagementCounts={showEngagementCounts}
          showStatusPill={showStatusPill}
          showPriorityFlag={showPriorityFlag}
          className={className}
        />
      );
  }
}

// Export default for convenience
export default UnifiedTaskCard;
