import { CheckCircle2 } from "lucide-react";
import { WorkspaceRole } from "@/hooks/useWorkspace"
import { EmptyState as SharedEmptyState } from "@/components/Shared/EmptyState";

interface EmptyStateProps {
  hasFilters: boolean;
  searchQuery: string;
  onCreateTask: () => void;
  memberRole: WorkspaceRole | null;
}

export function EmptyState({
  hasFilters,
  searchQuery,
  onCreateTask,
  memberRole,
}: EmptyStateProps) {
  const showCreate = !searchQuery && !hasFilters && memberRole !== "GUEST";

  return (
    <div className="text-center py-12 rounded-xl bg-card border border-border">
      <SharedEmptyState
        icon={CheckCircle2}
        title={hasFilters ? "No tasks match your filters" : "No tasks yet"}
        description={
          hasFilters
            ? "Try adjusting your search or filters"
            : "Create your first task to get started"
        }
        action={
          showCreate
            ? { label: "Create Task", onClick: onCreateTask }
            : undefined
        }
      />
    </div>
  );
}
