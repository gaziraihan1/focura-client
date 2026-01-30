import { Calendar as CalendarIcon } from "lucide-react";

export function DayViewEmptyState() {
  return (
    <div className="text-center py-12">
      <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No tasks scheduled
      </h3>
      <p className="text-muted-foreground">
        You have a free day! Enjoy your time or add some tasks.
      </p>
    </div>
  );
}