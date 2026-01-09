import React, { useMemo } from 'react';
import { 
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isPast
} from 'date-fns';
import { Task } from '@/hooks/useTask';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarDayView } from './CalendarDayView';
import { CalendarDay } from './CalendarDay';

interface CalendarGridProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day';
  tasks: Task[];
  dateRange: { start: Date; end: Date };
  onTaskClick: (task: Task) => void;
  isLoading: boolean;
}

export function CalendarGrid({
  currentDate,
  view,
  tasks,
  dateRange,
  onTaskClick,
  isLoading,
}: CalendarGridProps) {
  const calendarDays = useMemo(() => {
    return eachDayOfInterval({
      start: dateRange.start,
      end: dateRange.end,
    });
  }, [dateRange]);

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

    calendarDays.forEach((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayTasks = tasksByDate.get(dateKey) || [];
      density.set(dateKey, dayTasks.length);
    });

    return density;
  }, [calendarDays, tasksByDate]);

  if (view === 'week') {
    return (
      <CalendarWeekView
        currentDate={currentDate}
        tasks={tasks}
        onTaskClick={onTaskClick}
        isLoading={isLoading}
      />
    );
  }

  if (view === 'day') {
    return (
      <CalendarDayView
        currentDate={currentDate}
        tasks={tasks}
        onTaskClick={onTaskClick}
        isLoading={isLoading}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background p-2 sm:p-3 lg:p-4">
      <div className="grid grid-cols-7 gap-px mb-px">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-muted py-2 sm:py-3 text-center text-[10px] sm:text-xs font-semibold text-muted-foreground tracking-wider uppercase"
          >
            <span className="hidden xs:inline">{day}</span>
            <span className="xs:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-border" style={{ height: 'calc(100% - 40px)' }}>
        {calendarDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDate.get(dateKey) || [];
          const density = densityByDate.get(dateKey) || 0;

          return (
            <CalendarDay
              key={dateKey}
              date={day}
              tasks={dayTasks}
              density={density}
              isCurrentMonth={isSameMonth(day, currentDate)}
              isToday={isToday(day)}
              isPast={isPast(day) && !isToday(day)}
              onTaskClick={onTaskClick}
            />
          );
        })}
      </div>
    </div>
  );
}