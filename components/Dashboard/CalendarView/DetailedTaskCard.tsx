import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { Clock, User, Users } from "lucide-react";

interface DetailedTaskCardProps {
  task: Task;
  onClick: () => void;
  variant: 'overdue' | 'urgent' | 'high' | 'medium' | 'low';
}

export default function DetailedTaskCard({ task, onClick, variant }: DetailedTaskCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'overdue':
        return 'border-l-4 border-l-destructive bg-destructive/10 hover:bg-destructive/20';
      case 'urgent':
        return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30';
      case 'high':
        return 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/30';
      case 'medium':
        return 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30';
      case 'low':
        return 'border-l-4 border-l-gray-400 bg-gray-50 dark:bg-gray-950/20 hover:bg-gray-100 dark:hover:bg-gray-950/30';
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'IN_REVIEW':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg transition-all group',
        getVariantStyles()
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-base font-semibold text-foreground group-hover:text-primary flex-1">
          {task.title}
        </h4>
        <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStatusColor())}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        {task.estimatedHours && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{task.estimatedHours}h</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {task.assignees.length === 0 ? (
            <>
              <User className="w-4 h-4" />
              <span>Personal</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              <span>{task.assignees.length} assignee{task.assignees.length > 1 ? 's' : ''}</span>
            </>
          )}
        </div>

        {task.project && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: task.project.color }}
            />
            <span>{task.project.name}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
          <span>💬 {task._count.comments}</span>
          <span>📋 {task._count.subtasks}</span>
          <span>📎 {task._count.files}</span>
        </div>
      </div>
    </button>
  );
}