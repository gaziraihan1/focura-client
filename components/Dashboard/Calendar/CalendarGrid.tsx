import { GoalCheckpoint } from '@/types/calendarPage.types';
import { CalendarDayCell } from './CalendarDayCell';
import type { CalendarDayAggregate } from '@/types/calendar.types';
import { getWorkloadColor } from '@/utils/calendar.utils';

interface CalendarGridProps {
  calendarDays: Date[];
  getAggregateForDate: (date: Date) => CalendarDayAggregate | undefined;
  getGoalsForDate: (date: Date) => GoalCheckpoint[];
  isToday: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  onDateClick: (date: Date) => void;
}

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid({
  calendarDays,
  getAggregateForDate,
  getGoalsForDate,
  isToday,
  isCurrentMonth,
  onDateClick,
}: CalendarGridProps) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            className="p-4 text-center text-sm font-semibold text-muted-foreground border-r last:border-r-0 border-border"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const aggregate = getAggregateForDate(day);
          const workloadColor = aggregate
            ? getWorkloadColor(aggregate.workloadScore, aggregate.overCapacity)
            : 'bg-background';
          const goals = getGoalsForDate(day);

          return (
            <CalendarDayCell
              key={index}
              date={day}
              aggregate={aggregate}
              goals={goals}
              isToday={isToday(day)}
              isCurrentMonth={isCurrentMonth(day)}
              workloadColor={workloadColor}
              onClick={() => onDateClick(day)}
            />
          );
        })}
      </div>
    </div>
  );
}