import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";

interface KanbanCardHeaderProps {
  priority: Priority;
  isCompleted: boolean;
  isBlocked: boolean;
}

export function KanbanCardHeader({
  priority,
  isCompleted,
  isBlocked,
}: KanbanCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2 mb-2">
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span
          className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
            priority === "URGENT" && "bg-red-500 text-white",
            priority === "HIGH" && "bg-orange-500 text-white",
            priority === "MEDIUM" && "bg-blue-500 text-white",
            priority === "LOW" && "bg-gray-500 text-white"
          )}
        >
          {priority}
        </span>
      </div>

      {isCompleted && (
        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
      )}
      {isBlocked && (
        <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
      )}
    </div>
  );
}