import React, { useMemo } from 'react';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  isToday,
  isPast
} from 'date-fns';
import { Task } from '@/hooks/useTask';
import { CalendarDay } from './CalendarDay';

interface CalendarWeekViewProps {
  currentDate: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  isLoading: boolean;
}

export function CalendarWeekView({
  currentDate,
  tasks,
  onTaskClick,
  isLoading,
}: CalendarWeekViewProps) {
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, Task[]>();

    tasks.forEach((task) => {
      const date = task.dueDate || task.startDate;
      if (!date) return;

      const dateKey = format(new Date(date), 'yyyy-MM-dd');
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(task);
    });

    return grouped;
  }, [tasks]);

  const densityByDate = useMemo(() => {
    const density = new Map<string, number>();

    weekDays.forEach((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayTasks = tasksByDate.get(dateKey) || [];
      density.set(dateKey, dayTasks.length);
    });

    return density;
  }, [weekDays, tasksByDate]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading week...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background p-2 sm:p-3 lg:p-4">
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
        {weekDays.map((day) => (
          <div
            key={format(day, 'yyyy-MM-dd')}
            className="text-center"
          >
            <div className="text-[9px] sm:text-xs font-semibold text-muted-foreground uppercase mb-0.5 sm:mb-1">
              {format(day, 'EEE')}
            </div>
            <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${isToday(day) ? 'text-primary' : 'text-foreground'}`}>
              {format(day, 'd')}
            </div>
            <div className="text-[9px] sm:text-xs text-muted-foreground">
              {format(day, 'MMM')}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2" style={{ height: 'calc(100% - 80px)' }}>
        {weekDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDate.get(dateKey) || [];
          const density = densityByDate.get(dateKey) || 0;

          return (
            <div
              key={dateKey}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <CalendarDay
                date={day}
                tasks={dayTasks}
                density={density}
                isCurrentMonth={true}
                isToday={isToday(day)}
                isPast={isPast(day) && !isToday(day)}
                onTaskClick={onTaskClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}