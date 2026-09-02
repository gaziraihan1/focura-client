import { format, startOfWeek } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToday}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm"
          >
            Today
          </Button>

          <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="rounded-lg p-1.5"
              aria-label="Previous"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            
            <h1 className="text-base sm:text-xl font-semibold min-w-25 sm:min-w-35 text-center">
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
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="rounded-lg p-1.5"
              aria-label="Next"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => onToggleTimeBound(!showOnlyTimeBound)}
            className={`gap-1.5 rounded-lg px-2 py-1.5 text-xs sm:gap-2 sm:text-sm xl:px-3 xl:py-2 ${
              showOnlyTimeBound
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden md:inline">Time-bound only</span>
            <span className="md:hidden">Time</span>
          </Button>

          <div className="flex items-center gap-0.5 sm:gap-1 bg-muted rounded-lg p-0.5 sm:p-1">
            {(['month', 'week', 'day'] as const).map((v) => (
              <Button
                key={v}
                variant="ghost"
                onClick={() => onViewChange(v)}
                className={`rounded-md px-2 py-1 text-xs font-medium capitalize transition-all sm:px-3 sm:py-1.5 sm:text-sm lg:px-4 ${
                  view === v
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="hidden sm:inline">{v}</span>
                <span className="sm:hidden">{v.charAt(0).toUpperCase()}</span>
              </Button>
            ))}
          </div>

          <div className="p-2 hidden lg:block">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}