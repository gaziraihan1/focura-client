import { LabelWithTasks, PaginationMeta } from "@/hooks/useLabels";
import { Tag } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { TaskCard } from "./TaskCard";
import { PaginationControls } from "./PaginationControls";

interface TaskGridProps {
  tasks?:       LabelWithTasks["tasks"];
  pagination:   PaginationMeta;
  onPageChange: (page: number) => void;
}

export function TaskGrid({ tasks, pagination, onPageChange }: TaskGridProps) {
  if (!tasks || (tasks.length === 0 && pagination.page === 1)) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <EmptyState
          icon={Tag}
          title="No tasks yet"
          description="Tasks assigned to this label will appear here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map(({ task }) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <PaginationControls pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}