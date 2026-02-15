// components/Dashboard/AllTasks/TasksContent.tsx
import { TaskList } from "@/components/Dashboard/AllTasks/TaskList";
import { Pagination } from "@/components/Shared/Pagination";
import { Task } from "@/hooks/useTask";

interface TasksContentProps {
  tasks: Task[];
  focusedTaskId?: string | null;
  focusTimeRemaining?: number;
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onCreateTask: () => void;
  onPageChange: (page: number) => void;
}

export function TasksContent({
  tasks,
  focusedTaskId,
  focusTimeRemaining,
  isLoading,
  isError,
  searchQuery,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onCreateTask,
  onPageChange,
}: TasksContentProps) {
  return (
    <>
      <TaskList
        tasks={tasks}
        focusedTaskId={focusedTaskId}
        focusTimeRemaining={focusTimeRemaining}
        isLoading={isLoading}
        isError={isError}
        searchQuery={searchQuery}
        onCreateTask={onCreateTask}
      />

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}
    </>
  );
}