// Migrated to use UnifiedTaskCard for consistency
// TODO: Eventually remove this file and update imports to use UnifiedTaskCard directly
import { UnifiedTaskCard } from "@/components/Tasks/UnifiedTaskCard";
import { Task } from "@/hooks/useTask";

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

// oxlint-disable-next-line react-doctor/no-many-boolean-props -- shared component API with deliberate state flags
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
  return (
    <UnifiedTaskCard 
      task={task} 
      variant="workspace"
      workspaceSlug={workspaceSlug}
      onAddToPrimary={onAddToPrimary}
      onAddToSecondary={onAddToSecondary}
      isPrimaryDisabled={isPrimaryDisabled}
      showAddButtons={showAddButtons}
      loadingTaskId={loadingTaskId}
      loadingType={loadingType}
      isInPrimary={isInPrimary}
      isInSecondary={isInSecondary}
    />
  );
}
