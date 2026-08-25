"use client";

// Migrated to use UnifiedTaskCard for consistency
// TODO: Eventually remove this file and update imports to use UnifiedTaskCard directly
import { UnifiedTaskCard } from "@/components/Tasks/UnifiedTaskCard";
import { Task } from "@/hooks/useTask";

export interface TaskCardTeamProps {
  task: Task;
  index: number;
}

export function TaskCardTeam({ task, index }: TaskCardTeamProps) {
  return (
    <UnifiedTaskCard 
      task={task} 
      variant="team"
      index={index}
      enableAnimation={true}
    />
  );
}