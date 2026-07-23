"use client";

import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange, Calendar } from "lucide-react";

type CalendarViewType = "month" | "week" | "day";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarViewType;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarViewType) => void;
}

const VIEW_OPTIONS: Array<{ value: CalendarViewType; label: string; icon: React.ElementType }> = [
  { value: "month", label: "Month", icon: CalendarDays },
  { value: "week", label: "Week", icon: CalendarRange },
  { value: "day", label: "Day", icon: Calendar },
];

export function CalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
}: CalendarHeaderProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        onPrevious();
        break;
      case "ArrowRight":
        e.preventDefault();
        onNext();
        break;
      case "t":
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          onToday();
        }
        break;
    }
  };

  return (
    <div
      className="border-b border-border bg-card sticky top-0 z-10"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title */}
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
              Time Intelligence
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Strategic overview of your time and capacity
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switcher */}
            <div
              className="flex items-center gap-0.5 p-1 rounded-lg bg-muted border border-border"
              role="radiogroup"
              aria-label="Calendar view"
            >
              {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => onViewChange(value)}
                  role="radio"
                  aria-checked={view === value}
                  aria-label={`${label} view`}
                  className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    view === value
                      ? "bg-background text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Today Button */}
            <button
              onClick={onToday}
              aria-label="Go to today"
              className="px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Today
            </button>

            {/* Navigation */}
            <div
              className="flex items-center gap-1 border border-border rounded-lg p-1 bg-background"
              role="navigation"
              aria-label="Calendar navigation"
            >
              <button
                onClick={onPrevious}
                aria-label="Previous period"
                className="p-2 hover:bg-accent rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>

              <span
                className="px-2 sm:px-4 text-sm font-medium min-w-30 sm:min-w-35 text-center"
                aria-live="polite"
                aria-atomic="true"
              >
                {formatDateForHeader(currentDate, view)}
              </span>

              <button
                onClick={onNext}
                aria-label="Next period"
                className="p-2 hover:bg-accent rounded-md transition-colors"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDateForHeader(date: Date, view: CalendarViewType): string {
  const options: Intl.DateTimeFormatOptions =
    view === "day"
      ? { weekday: "long", month: "long", day: "numeric", year: "numeric" }
      : view === "week"
      ? { month: "long", year: "numeric" }
      : { month: "long", year: "numeric" };

  if (view === "week") {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startMonth = weekStart.toLocaleString("default", { month: "short" });
    const endMonth = weekEnd.toLocaleString("default", { month: "short" });
    const year = weekEnd.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${year}`;
    }
    return `${startMonth} ${weekStart.getDate()} – ${endMonth} ${weekEnd.getDate()}, ${year}`;
  }

  return date.toLocaleString("default", options);
}
