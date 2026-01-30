import { format, isToday } from "date-fns";

interface DayViewHeaderProps {
  currentDate: Date;
}

export function DayViewHeader({ currentDate }: DayViewHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <h2 className="text-4xl font-bold text-foreground">
          {format(currentDate, "EEEE")}
        </h2>
        <p className="text-lg text-muted-foreground">
          {format(currentDate, "MMMM d, yyyy")}
        </p>
      </div>
      {isToday(currentDate) && (
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold">
          Today
        </div>
      )}
    </div>
  );
}