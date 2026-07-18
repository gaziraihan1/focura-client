import Link from "next/link";
import { Task } from "@/hooks/useTask";
import { TaskCardHeader, TaskCardMetaChips, TaskCardProgressAssignees } from "./TaskCardParts";

interface TaskCardProps {
  task: Task;
  workspaceSlug: string;
  onAddToPrimary?: (taskId: string) => void;
  onAddToSecondary?: (taskId: string) => void;
  isPrimaryDisabled?: boolean;
  showAddButtons?: boolean;
  loadingTaskId?: string | null;
  loadingType?: "primary" | "secondary" | null;
  isInPrimary?: boolean;
  isInSecondary?: boolean;
}

export function TaskCard({
  task,
  workspaceSlug,
  onAddToPrimary,
  onAddToSecondary,
  isPrimaryDisabled = false,
  showAddButtons = false,
  loadingTaskId,
  loadingType,
  isInPrimary = false,
  isInSecondary = false,
}: TaskCardProps) {
  const isCompleted = task.status === "COMPLETED";
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

  const progress =
    task.timeTracking?.timeProgress != null
      ? Math.min(100, task.timeTracking.timeProgress)
      : null;

  return (
    <Link
      href={`/dashboard/workspaces/${workspaceSlug}/projects/${task.project?.slug}/tasks/${task.id}`}
    >
      <div
        className={`
          group relative rounded-2xl border bg-card overflow-hidden
          transition-all duration-300 ease-out
          hover:shadow-[0_8px_32px_-4px_hsl(var(--foreground)/0.12)]
          hover:-translate-y-0.5 hover:border-primary/30
          ${isCompleted ? "opacity-70" : ""}
        `}
      >
        <div className="p-5">
          <TaskCardHeader
            task={task}
            showButtons={showButtons}
            isPrimaryDisabled={isPrimaryDisabled}
            isInPrimary={isInPrimary}
            isInSecondary={isInSecondary}
            primaryDisabled={primaryDisabled}
            secondaryDisabled={secondaryDisabled}
            isPrimaryLoading={isPrimaryLoading}
            isSecondaryLoading={isSecondaryLoading}
            handlePrimaryClick={handlePrimaryClick}
            handleSecondaryClick={handleSecondaryClick}
          />

          <TaskCardMetaChips task={task} />

          <TaskCardProgressAssignees task={task} progress={progress} />
        </div>
      </div>
    </Link>
  );
}
