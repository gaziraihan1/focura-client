import { motion } from "framer-motion";
import { Task } from "@/hooks/useTask";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  workspaceSlug: string;
  onAddToPrimary?: (taskId: string) => void;
  onAddToSecondary?: (taskId: string) => void;
  isPrimaryDisabled?: boolean;
  showAddButtons?: boolean;
  loadingTaskId?: string | null;
  loadingType?: "primary" | "secondary" | null;
  primaryTaskId?: string | null;
  secondaryTaskIds?: string[];

}

export function TaskList({
  tasks,
  workspaceSlug,
  onAddToPrimary,
  onAddToSecondary,
  isPrimaryDisabled = false,
  showAddButtons = false,
  loadingTaskId,
  loadingType,
  primaryTaskId,
  secondaryTaskIds
}: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02 }}
        >
          <TaskCard
            task={task}
            workspaceSlug={workspaceSlug}
            onAddToPrimary={onAddToPrimary}
            onAddToSecondary={onAddToSecondary}
            isPrimaryDisabled={isPrimaryDisabled}
            showAddButtons={showAddButtons}
            loadingTaskId={loadingTaskId}
            loadingType={loadingType}
            isInPrimary={primaryTaskId === task.id}
            isInSecondary={secondaryTaskIds?.includes(task.id)
            }

          />
        </motion.div>
      ))}
    </div>
  );
}