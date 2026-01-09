import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { Clock, Users } from "lucide-react";

interface TaskPillProps {
  task: Task;
  isPersonal: boolean;
  isOverdue: boolean;
  onClick: () => void;
}

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
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-1 sm:px-1.5 lg:px-2 py-0.5 sm:py-1 lg:py-1.5 rounded text-[9px] sm:text-[10px] lg:text-xs transition-all hover:shadow-md group',
        getPriorityColor(),
        isOverdue && 'bg-destructive/20 border-l-destructive animate-pulse',
        'relative overflow-hidden'
      )}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 justify-between">
        <span className="font-medium truncate flex-1 group-hover:font-semibold">
          {task.title}
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
    </button>
  );
}