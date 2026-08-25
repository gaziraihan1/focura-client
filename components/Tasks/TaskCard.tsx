// Backwards-compatible export - redirects to unified component
// TODO: Eventually remove this file and update all imports to use UnifiedTaskCard
import { Task } from "@/types/task.types";
import { UnifiedTaskCard, type TaskCardProps } from './UnifiedTaskCard';

// Original simple TaskCard API
export default function TaskCard({ task }: { task: Task }) {
  // types/task.types.Task (API shape) and hooks/useTask.Task (card view-model)
  // are structurally different; this legacy shim only feeds the fields the
  // "simple" variant reads. Cast until callers migrate to UnifiedTaskCard.
  return (
    <UnifiedTaskCard
      task={task as unknown as TaskCardProps["task"]}
      variant="simple"
    />
  );
}

// Export the unified component and types for direct usage
export { UnifiedTaskCard };
export type { TaskCardVariant, TaskCardProps, TaskSectionBadge, SectionsById } from './UnifiedTaskCard';
