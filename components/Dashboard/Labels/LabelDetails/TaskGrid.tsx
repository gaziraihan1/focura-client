import { LabelWithTasks, PaginationMeta } from "@/hooks/useLabels";
import { LabelEmptyState } from "./LabelEmptyState";
import { TaskCard } from "./TaskCard";
import { PaginationControls } from "./PaginationControls";

interface TaskGridProps {
  tasks?:       LabelWithTasks["tasks"];
  pagination:   PaginationMeta;
  onPageChange: (page: number) => void;
}

export function TaskGrid({ tasks, pagination, onPageChange }: TaskGridProps) {
  if (!tasks || (tasks.length === 0 && pagination.page === 1)) {
    return <LabelEmptyState />;
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