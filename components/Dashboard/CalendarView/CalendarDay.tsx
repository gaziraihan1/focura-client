import React, { useMemo } from 'react';
import { format, isPast } from 'date-fns';
import { Task } from '@/hooks/useTask';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import TaskPill from './TaskPill';

interface CalendarDayProps {
  date: Date;
  tasks: Task[];
  density: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  onTaskClick: (task: Task) => void;
}

export function CalendarDay({
  date,
  tasks,
  density,
  isCurrentMonth,
  isToday: isTodayDate,
  onTaskClick,
}: CalendarDayProps) {
  const overloadStatus = useMemo(() => {
    if (density === 0) return 'none';
    if (density <= 3) return 'normal';
    if (density <= 6) return 'warning';
    return 'critical';
  }, [density]);

  const { overdueTasks } = useMemo(() => {
    const personal: Task[] = [];
    const assigned: Task[] = [];
    const overdue: Task[] = [];

    tasks.forEach((task) => {
      if (task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'COMPLETED') {
        overdue.push(task);
      }

      if (task.assignees.length === 0) {
        personal.push(task);
      } else {
        assigned.push(task);
      }
    });

    return { personalTasks: personal, assignedTasks: assigned, overdueTasks: overdue };
  }, [tasks]);

  const getBgColor = () => {
    if (!isCurrentMonth) return 'bg-muted/30';
    
    switch (overloadStatus) {
      case 'critical':
        return 'bg-destructive/10 hover:bg-destructive/20';
      case 'warning':
        return 'bg-amber-500/10 hover:bg-amber-500/20';
      case 'normal':
        return 'bg-primary/5 hover:bg-primary/10';
      default:
        return 'bg-card hover:bg-accent/50';
    }
  };

  const visibleTasks = tasks.slice(0, 4);
  const hasMoreTasks = tasks.length > 4;

  return (
    <div
      className={cn(
        'relative min-h-20 sm:min-h-[100px] lg:min-h-[120px] p-1 sm:p-1.5 lg:p-2 transition-all border-none',
        getBgColor(),
        !isCurrentMonth && 'opacity-40'
      )}
    >
      <div className="flex items-start justify-between mb-1 sm:mb-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <span
            className={cn(
              'text-[11px] sm:text-xs lg:text-sm font-semibold',
              isTodayDate && 'flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-primary text-primary-foreground rounded-full text-[10px] sm:text-xs',
              !isTodayDate && isCurrentMonth && 'text-foreground',
              !isTodayDate && !isCurrentMonth && 'text-muted-foreground'
            )}
          >
            {format(date, 'd')}
          </span>

          {density > 0 && (
            <span
              className={cn(
                'text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full',
                overloadStatus === 'critical' && 'bg-destructive text-destructive-foreground',
                overloadStatus === 'warning' && 'bg-amber-500 text-white',
                overloadStatus === 'normal' && 'bg-primary/20 text-primary'
              )}
            >
              {density}
            </span>
          )}
        </div>

        {overloadStatus === 'critical' && (
          <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-destructive animate-pulse hidden xs:block" />
        )}
      </div>

      <div className="space-y-0.5 sm:space-y-1">
        {visibleTasks.map((task) => (
          <TaskPill
            key={task.id}
            task={task}
            isPersonal={task.assignees.length === 0}
            isOverdue={overdueTasks.includes(task)}
            onClick={() => onTaskClick(task)}
          />
        ))}

        {hasMoreTasks && (
          <div className="text-[9px] sm:text-[10px] text-muted-foreground font-medium px-1 sm:px-2 py-0.5 sm:py-1">
            +{tasks.length - 4} more
          </div>
        )}
      </div>

      {tasks.length === 0 && isCurrentMonth && (
        <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-[10px] sm:text-xs text-muted-foreground">Free time</span>
        </div>
      )}
    </div>
  );
}
