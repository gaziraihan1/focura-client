import { memo } from 'react';
import { Target, Zap, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { KanbanScope } from '@/hooks/useKanbanPage';

interface KanbanHeaderProps {
  scope: KanbanScope;
  onScopeChange: (scope: KanbanScope) => void;
  taskCounts: {
    total: number;
    inProgress: number;
    blocked: number;
  };
  focusMode: boolean;
  onFocusModeChange: (enabled: boolean) => void;
}

export const KanbanHeader = memo(function KanbanHeader({
  scope,
  onScopeChange,
  taskCounts,
  focusMode,
  onFocusModeChange,
}: KanbanHeaderProps) {
  return (
    <header className="border-b border-border bg-card px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Kanban <span className="hidden sm:inline text-muted-foreground font-normal">– Execution Flow</span>
            </h1>
          </div>

          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {(['personal', 'assigned', 'team'] as const).map((s) => (
              <Button
                key={s}
                variant="ghost"
                onClick={() => onScopeChange(s)}
                className={cn(
                  'px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all capitalize',
                  scope === s
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{taskCounts.total} tasks</span>
            <span className="hidden sm:inline">·</span>
            <span className={cn(
              taskCounts.inProgress > 0 && 'text-blue-600 dark:text-blue-400'
            )}>
              {taskCounts.inProgress} in progress
            </span>
            {taskCounts.blocked > 0 && (
              <>
                <span className="hidden sm:inline">·</span>
                <span className="text-destructive font-medium">
                  {taskCounts.blocked} blocked
                </span>
              </>
            )}
          </div>

          <Button
            variant="primary"
            onClick={() => onFocusModeChange(!focusMode)}
            className={cn(
              'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all font-medium',
              focusMode
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden md:inline">Focus</span>
          </Button>

          <Button variant="ghost" className="p-1.5 sm:p-2 rounded-lg transition-colors" aria-label="Settings">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
});