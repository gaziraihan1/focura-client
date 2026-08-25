// Migrated to use UnifiedTaskCard for consistency
// TODO: Eventually remove this file and update imports to use UnifiedTaskCard directly
import { UnifiedTaskCard, TaskSectionBadge, SectionsById } from "@/components/Tasks/UnifiedTaskCard";
import { Task } from '@/hooks/useTask';

interface TaskCardProps {
  task: Task;
  workspaceSlug: string
  section?: TaskSectionBadge | null
}

// Re-export types for backwards compatibility
export type { TaskSectionBadge, SectionsById };

export default function TaskCard({ task, workspaceSlug, section }: TaskCardProps) {
  return (
    <UnifiedTaskCard 
      task={task} 
      variant="project" 
      workspaceSlug={workspaceSlug}
      section={section}
      showEngagementCounts={true}
      showAssignees={true}
    />
  );
}
