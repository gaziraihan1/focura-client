// components/Calendar/CalendarLegend.tsx
import { Zap, Target } from 'lucide-react';

export function CalendarLegend() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-blue-500/10 border border-blue-500/20" />
        <span className="text-muted-foreground">Normal</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30" />
        <span className="text-muted-foreground">Moderate</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/30" />
        <span className="text-muted-foreground">High Load</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30" />
        <span className="text-muted-foreground">Overloaded</span>
      </div>
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <span className="text-muted-foreground">Focus Day</span>
      </div>
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-blue-500" />
        <span className="text-muted-foreground">Milestone</span>
      </div>
    </div>
  );
}