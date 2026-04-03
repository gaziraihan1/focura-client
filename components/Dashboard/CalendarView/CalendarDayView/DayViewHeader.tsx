import { format, isToday } from "date-fns";

interface DayViewHeaderProps {
  currentDate: Date;
}

export function DayViewHeader({ currentDate }: DayViewHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <h2 className="text-lg sm:text-2xl lg:text-4xl font-bold text-foreground">
          {format(currentDate, "EEEE")}
        </h2>
        <p className="sm:text-lg text-muted-foreground">
          {format(currentDate, "MMMM d, yyyy")}
        </p>
      </div>
      {isToday(currentDate) && (
        <div className="bg-primary text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold">
          Today
        </div>
      )}
    </div>
  );
}