import { X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskModalHeaderProps {
  title: string;
  status: string;
  priority: string;
  isOverdue: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "IN_PROGRESS":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "IN_REVIEW":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case "BLOCKED":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case "CANCELLED":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "URGENT":
      return "text-red-600";
    case "HIGH":
      return "text-orange-500";
    case "MEDIUM":
      return "text-blue-500";
    case "LOW":
      return "text-gray-500";
    default:
      return "text-gray-500";
  }
};

export function TaskModalHeader({
  title,
  status,
  priority,
  isOverdue,
  onClose,
}: TaskModalHeaderProps) {
  return (
    <div className="border-b border-border p-6 bg-muted/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border",
                getStatusColor(status)
              )}
            >
              {status.replace("_", " ")}
            </span>

            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium bg-muted border border-border",
                getPriorityColor(priority)
              )}
            >
              {priority}
            </span>

            {isOverdue && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}