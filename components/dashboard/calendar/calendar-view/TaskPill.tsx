import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Clock, Users } from "lucide-react";

interface TaskPillProps {
  task: Task;
  isPersonal: boolean;
  isOverdue: boolean;
  onClick: () => void;
}

const STATUS_DOT: Record<string, string> = {
  COMPLETED: "bg-green-500",
  IN_PROGRESS: "bg-blue-500",
  IN_REVIEW: "bg-purple-500",
  BLOCKED: "bg-red-500",
  CANCELLED: "bg-gray-400",
  TODO: "bg-gray-300",
};

export default function TaskPill({ task, isPersonal, isOverdue, onClick }: TaskPillProps) {
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'URGENT':
        return 'border-l-2 sm:border-l-4 border-l-red-500 bg-red-500/10';
      case 'HIGH':
        return 'border-l-2 sm:border-l-4 border-l-orange-500 bg-orange-500/10';
      case 'MEDIUM':
        return 'border-l-2 sm:border-l-4 border-l-blue-500 bg-blue-500/10';
      case 'LOW':
        return 'border-l-2 sm:border-l-4 border-l-gray-400 bg-gray-400/10';
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'w-full justify-start px-1 py-0.5 text-left rounded text-[9px] transition-all hover:shadow-md group sm:px-1.5 sm:py-1 lg:px-2 lg:py-1.5 lg:text-xs sm:text-[10px]',
        getPriorityColor(),
        isOverdue && 'bg-destructive/20 border-l-destructive animate-pulse',
        'relative overflow-hidden'
      )}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 justify-between">
        <span className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1">
          <span
            aria-hidden
            className={cn(
              'w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full shrink-0',
              STATUS_DOT[task.status] ?? 'bg-gray-300'
            )}
          />
          <span className="font-medium truncate group-hover:font-semibold">
            {task.title}
          </span>
        </span>

        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {!isPersonal && (
            <Users className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 text-muted-foreground hidden xs:block" />
          )}

          {task.estimatedHours && (
            <span className="text-[8px] sm:text-[9px] lg:text-[10px] text-muted-foreground hidden sm:flex items-center gap-0.5">
              <Clock className="w-2 h-2 lg:w-2.5 lg:h-2.5" />
              {task.estimatedHours}h
            </span>
          )}
        </div>
      </div>

      {task.project && (
        <div
          className="absolute top-0 right-0 w-0.5 sm:w-1 h-full"
          style={{ backgroundColor: task.project.color }}
        />
      )}
    </Button>
  );
}
