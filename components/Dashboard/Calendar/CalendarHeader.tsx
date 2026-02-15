// components/Calendar/CalendarHeader.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="border-b border-border bg-card sticky top-0 z-10">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
              Time Intelligence
            </h1>
            <p className="text-muted-foreground mt-1">
              Strategic overview of your time and capacity
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToday}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Today
            </button>

            <div className="flex items-center gap-2 border border-border rounded-lg p-1 bg-background">
              <button
                onClick={onPreviousMonth}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-4 text-sm font-medium min-w-[140px] text-center">
                {currentDate.toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>

              <button
                onClick={onNextMonth}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}