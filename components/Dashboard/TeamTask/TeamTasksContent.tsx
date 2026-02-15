import { Task } from "@/hooks/useTask";
import { Section } from "@/components/Dashboard/TeamTask/Section";
import { TaskList } from "@/components/Dashboard/TeamTask/TaskList";
import { Pagination } from "@/components/Shared/Pagination";

interface TeamTasksContentProps {
  sectionTitle: string;
  tasks: Task[];
  isLoading: boolean;
  hasNoResults: boolean;
  attentionOnly: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function TeamTasksContent({
  sectionTitle,
  tasks,
  isLoading,
  hasNoResults,
  attentionOnly,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: TeamTasksContentProps) {
  return (
    <Section title={sectionTitle} highlight={attentionOnly}>
      <TaskList tasks={tasks} isLoading={isLoading} />

      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}

      {!isLoading && hasNoResults && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters
          </p>
        </div>
      )}
    </Section>
  );
}