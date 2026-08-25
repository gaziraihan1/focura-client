// Migrated to use UnifiedTaskCard for consistency
// TODO: Eventually remove this file and update imports to use UnifiedTaskCard directly
import { UnifiedTaskCard } from "@/components/Tasks/UnifiedTaskCard";
import { Task } from "@/hooks/useTask";

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  return (
    <UnifiedTaskCard 
      task={task} 
      variant="detailed" 
      index={index}
      enableAnimation={true}
    />
  );
}