import React, { useMemo } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { Task } from '@/hooks/useTask';
import { 
  AlertCircle,
  Flag,
  Calendar as CalendarIcon
} from 'lucide-react';
import DetailedTaskCard from './DetailedTaskCard';

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
  const dayTasks = useMemo(() => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    return tasks.filter((task) => {
      const taskDate = task.dueDate || task.startDate;
      if (!taskDate) return false;
      return format(new Date(taskDate), 'yyyy-MM-dd') === dateKey;
    });
  }, [tasks, currentDate]);

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
