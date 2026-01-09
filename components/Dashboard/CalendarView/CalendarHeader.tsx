import React from 'react';
import { format, startOfWeek } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Clock
} from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day';
  onViewChange: (view: 'month' | 'week' | 'day') => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  showOnlyTimeBound: boolean;
  onToggleTimeBound: (show: boolean) => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  showOnlyTimeBound,
  onToggleTimeBound,
}: CalendarHeaderProps) {
  return (
    <header className="border-b border-border bg-card px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        {/* Left Section - Date Display */}
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={onToday}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors whitespace-nowrap"
          >
            Today
          </button>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial">
            <button
              onClick={onPrevious}
              className="p-1.5 sm:p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <h1 className="text-base sm:text-xl lg:text-2xl font-semibold min-w-[140px] sm:min-w-[180px] lg:min-w-[220px] text-center">
              {view === 'month' && (
                <>
                  <span className="hidden sm:inline">{format(currentDate, 'MMMM yyyy')}</span>
                  <span className="sm:hidden">{format(currentDate, 'MMM yyyy')}</span>
                </>
              )}
              {view === 'week' && (
                <>
                  <span className="hidden sm:inline">Week of {format(startOfWeek(currentDate), 'MMM d')}</span>
                  <span className="sm:hidden">{format(startOfWeek(currentDate), 'MMM d')}</span>
                </>
              )}
              {view === 'day' && (
                <>
                  <span className="hidden sm:inline">{format(currentDate, 'MMMM d, yyyy')}</span>
                  <span className="sm:hidden">{format(currentDate, 'MMM d')}</span>
                </>
              )}
            </h1>
            
            <button
              onClick={onNext}
              className="p-1.5 sm:p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Right Section - View Controls & Filters */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Time-bound Filter */}
          <button
            onClick={() => onToggleTimeBound(!showOnlyTimeBound)}
            className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all ${
              showOnlyTimeBound
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden md:inline">Time-bound only</span>
            <span className="md:hidden">Time</span>
          </button>

          {/* View Selector */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-muted rounded-lg p-0.5 sm:p-1">
            {(['month', 'week', 'day'] as const).map((v) => (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all capitalize ${
                  view === v
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="hidden sm:inline">{v}</span>
                <span className="sm:hidden">{v.charAt(0).toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* Calendar Icon - Hidden on mobile */}
          <div className="p-2 hidden lg:block">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}