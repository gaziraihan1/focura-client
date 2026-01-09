import React, { useMemo } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { Task } from '@/hooks/useTask';
import { 
  Clock, 
  Users, 
  User, 
  AlertCircle,
  Flag,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarDayViewProps {
  currentDate: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  isLoading: boolean;
}

export function CalendarDayView({
  currentDate,
  tasks,
  onTaskClick,
  isLoading,
}: CalendarDayViewProps) {
  // Filter tasks for the selected day
  const dayTasks = useMemo(() => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    return tasks.filter((task) => {
      const taskDate = task.dueDate || task.startDate;
      if (!taskDate) return false;
      return format(new Date(taskDate), 'yyyy-MM-dd') === dateKey;
    });
  }, [tasks, currentDate]);

  // Categorize tasks
  const categorizedTasks = useMemo(() => {
    const urgent: Task[] = [];
    const high: Task[] = [];
    const medium: Task[] = [];
    const low: Task[] = [];
    const overdue: Task[] = [];

    dayTasks.forEach((task) => {
      if (task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'COMPLETED') {
        overdue.push(task);
        return;
      }

      switch (task.priority) {
        case 'URGENT':
          urgent.push(task);
          break;
        case 'HIGH':
          high.push(task);
          break;
        case 'MEDIUM':
          medium.push(task);
          break;
        case 'LOW':
          low.push(task);
          break;
      }
    });

    return { urgent, high, medium, low, overdue };
  }, [dayTasks]);

  const totalEstimatedHours = useMemo(() => {
    return dayTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
  }, [dayTasks]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading day...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background p-6 overflow-y-auto scrollbar-hide">
      {/* Day Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-4xl font-bold text-foreground">
              {format(currentDate, 'EEEE')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {format(currentDate, 'MMMM d, yyyy')}
            </p>
          </div>
          {isToday(currentDate) && (
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold">
              Today
            </div>
          )}
        </div>

        {/* Day Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Tasks</div>
            <div className="text-3xl font-bold text-foreground">{dayTasks.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Estimated Hours</div>
            <div className="text-3xl font-bold text-foreground">{totalEstimatedHours}h</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Personal</div>
            <div className="text-3xl font-bold text-foreground">
              {dayTasks.filter(t => t.assignees.length === 0).length}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Team</div>
            <div className="text-3xl font-bold text-foreground">
              {dayTasks.filter(t => t.assignees.length > 0).length}
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Tasks */}
      {categorizedTasks.overdue.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-destructive mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Overdue ({categorizedTasks.overdue.length})
          </h3>
          <div className="space-y-2">
            {categorizedTasks.overdue.map((task) => (
              <DetailedTaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                variant="overdue"
              />
            ))}
          </div>
        </div>
      )}

      {/* Urgent Tasks */}
      {categorizedTasks.urgent.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Urgent ({categorizedTasks.urgent.length})
          </h3>
          <div className="space-y-2">
            {categorizedTasks.urgent.map((task) => (
              <DetailedTaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                variant="urgent"
              />
            ))}
          </div>
        </div>
      )}

      {/* High Priority Tasks */}
      {categorizedTasks.high.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-orange-600 mb-3">
            High Priority ({categorizedTasks.high.length})
          </h3>
          <div className="space-y-2">
            {categorizedTasks.high.map((task) => (
              <DetailedTaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                variant="high"
              />
            ))}
          </div>
        </div>
      )}

      {/* Medium Priority Tasks */}
      {categorizedTasks.medium.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">
            Medium Priority ({categorizedTasks.medium.length})
          </h3>
          <div className="space-y-2">
            {categorizedTasks.medium.map((task) => (
              <DetailedTaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                variant="medium"
              />
            ))}
          </div>
        </div>
      )}

      {/* Low Priority Tasks */}
      {categorizedTasks.low.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-3">
            Low Priority ({categorizedTasks.low.length})
          </h3>
          <div className="space-y-2">
            {categorizedTasks.low.map((task) => (
              <DetailedTaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                variant="low"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {dayTasks.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No tasks scheduled
          </h3>
          <p className="text-muted-foreground">
            You have a free day! Enjoy your time or add some tasks.
          </p>
        </div>
      )}
    </div>
  );
}

interface DetailedTaskCardProps {
  task: Task;
  onClick: () => void;
  variant: 'overdue' | 'urgent' | 'high' | 'medium' | 'low';
}

function DetailedTaskCard({ task, onClick, variant }: DetailedTaskCardProps) {
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
        {/* Estimated Hours */}
        {task.estimatedHours && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{task.estimatedHours}h</span>
          </div>
        )}

        {/* Assignees */}
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

        {/* Project */}
        {task.project && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: task.project.color }}
            />
            <span>{task.project.name}</span>
          </div>
        )}

        {/* Activity Counts */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
          <span>💬 {task._count.comments}</span>
          <span>📋 {task._count.subtasks}</span>
          <span>📎 {task._count.files}</span>
        </div>
      </div>
    </button>
  );
}