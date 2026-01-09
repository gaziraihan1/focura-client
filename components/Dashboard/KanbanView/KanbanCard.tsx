import React from 'react';
import { Task } from '@/hooks/useTask';
import { 
  Clock, 
  MessageSquare, 
  Paperclip, 
  User, 
  Users,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  task: Task;
  onClick: () => void;
  isBlocked?: boolean;
}

export function KanbanCard({ task, onClick, isBlocked = false }: KanbanCardProps) {
  const daysStale = differenceInDays(new Date(), parseISO(task.updatedAt));
  const agingStatus = daysStale <= 2 ? 'normal' : daysStale <= 5 ? 'warning' : 'critical';

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'URGENT':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'HIGH':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'MEDIUM':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'LOW':
        return 'border-l-gray-400 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const getAgingBorder = () => {
    if (agingStatus === 'critical') return 'ring-2 ring-destructive';
    if (agingStatus === 'warning') return 'ring-2 ring-amber-500';
    return '';
  };

  const subtaskProgress = task._count.subtasks > 0
    ? (task._count.subtasks * 0.7) // Mock completion percentage
    : 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 sm:p-4 rounded-lg border-l-4 transition-all group hover:shadow-md',
        getPriorityColor(),
        getAgingBorder(),
        isBlocked && 'bg-destructive/10',
        agingStatus === 'critical' && 'animate-pulse'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className={cn(
            'text-[10px] font-bold px-1.5 py-0.5 rounded uppercase',
            task.priority === 'URGENT' && 'bg-red-500 text-white',
            task.priority === 'HIGH' && 'bg-orange-500 text-white',
            task.priority === 'MEDIUM' && 'bg-blue-500 text-white',
            task.priority === 'LOW' && 'bg-gray-500 text-white'
          )}>
            {task.priority}
          </span>
        </div>

        {task.status === 'COMPLETED' && (
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
        )}
        {isBlocked && (
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
        )}
      </div>

      <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="space-y-2 mb-3">
        {daysStale > 0 && (
          <div className={cn(
            'inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] sm:text-xs font-medium',
            agingStatus === 'critical' && 'bg-destructive/20 text-destructive',
            agingStatus === 'warning' && 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
            agingStatus === 'normal' && 'bg-muted text-muted-foreground'
          )}>
            <Clock className="w-3 h-3" />
            <span>{daysStale}d in {task.status.toLowerCase().replace('_', ' ')}</span>
          </div>
        )}

        {isBlocked && (
          <div className="bg-destructive/20 border border-destructive/30 rounded px-2 py-1.5 text-xs text-destructive">
            <strong>Blocked:</strong> Waiting for review
          </div>
        )}

        {task._count.subtasks > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Subtasks</span>
              <span>{Math.round(subtaskProgress)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${subtaskProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {task.assignees.length === 0 ? (
            <>
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unassigned</span>
            </>
          ) : (
            <>
              <Users className="w-3.5 h-3.5" />
              <span>{task.assignees.length}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
          {task._count.comments > 0 && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs">
              <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{task._count.comments}</span>
            </div>
          )}
          
          {task._count.files > 0 && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs">
              <Paperclip className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{task._count.files}</span>
            </div>
          )}
          
          {task.dueDate && (
            <div className={cn(
              'text-[10px] sm:text-xs',
              isOverdue && 'text-destructive font-medium'
            )}>
              {format(parseISO(task.dueDate), 'MMM d')}
            </div>
          )}
        </div>
      </div>

      {task.project && (
        <div
          className="absolute top-0 right-0 w-1 h-full rounded-r-lg"
          style={{ backgroundColor: task.project.color }}
        />
      )}
    </button>
  );
}