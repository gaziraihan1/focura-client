import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { KanbanFilters } from "@/hooks/useKanbanPage";

interface FiltersPanelProps {
  filters: KanbanFilters;
  onTogglePriority: (priority: string) => void;
  onClearFilters: () => void;
}

const PRIORITIES = ["URGENT", "HIGH", "MEDIUM", "LOW"] as const;

const getPriorityStyles = (priority: string, isActive: boolean) => {
  if (!isActive) {
    return "bg-background border border-border text-muted-foreground hover:bg-accent";
  }

  switch (priority) {
    case "URGENT":
      return "bg-red-500 text-white";
    case "HIGH":
      return "bg-orange-500 text-white";
    case "MEDIUM":
      return "bg-blue-500 text-white";
    case "LOW":
      return "bg-gray-500 text-white";
    default:
      return "bg-background border border-border text-muted-foreground";
  }
};

export function FiltersPanel({
  filters,
  onTogglePriority,
  onClearFilters,
}: FiltersPanelProps) {
  return (
    <div className="border-t border-border bg-muted/50 px-3 sm:px-4 lg:px-6 py-3">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <span className="text-xs font-semibold text-muted-foreground mb-2 block">
            Priority
          </span>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((priority) => {
              const isActive = filters.priority?.includes(priority) || false;
              return (
                <Button
                  key={priority}
                  variant="primary"
                  onClick={() => onTogglePriority(priority)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-md transition-all",
                    getPriorityStyles(priority, isActive)
                  )}
                >
                  {priority}
                </Button>
              );
            })}
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="self-end flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear filters</span>
        </Button>
      </div>
    </div>
  );
}