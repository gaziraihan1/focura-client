import { Task } from "@/hooks/useTask";
import { TaskList } from "@/components/Dashboard/AllTasks/TaskList";
import { Pagination } from "@/components/Shared/Pagination";

interface TasksContentProps {
  tasks: Task[];
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