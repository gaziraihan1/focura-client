import { CheckCircle2 } from "lucide-react";

interface EmptyStateProps {
  hasFilters: boolean;
  searchQuery: string;
  onCreateTask: () => void;
}

export function EmptyState({
  hasFilters,
  searchQuery,
  onCreateTask,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 rounded-xl bg-card border border-border">
      <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {hasFilters ? "No tasks match your filters" : "No tasks yet"}
      </h3>
      <p className="text-muted-foreground mb-6">
        {hasFilters
          ? "Try adjusting your search or filters"
          : "Create your first task to get started"}
      </p>
      {!searchQuery && !hasFilters && (
        <button
          onClick={onCreateTask}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Create Task
        </button>
      )}
    </div>
  );
}