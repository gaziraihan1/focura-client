import React from 'react';
import { Task } from '@/hooks/useTask';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KanbanCard } from './KanbanCard';
import { ColumnConfig } from '@/hooks/useKanbanBoard';

interface KanbanColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  stats: {
    count: number;
    avgDays: number;
    isBottleneck: boolean;
  };
  enforceWIP: boolean;
  onTaskClick: (task: Task) => void;
  isMobile?: boolean;
}

export function KanbanColumn({
  column,
  tasks,
  stats,
  enforceWIP,
  onTaskClick,
  isMobile = false,
}: KanbanColumnProps) {
  const isOverLimit = enforceWIP && stats.count > column.wipLimit;
  const isNearLimit = enforceWIP && stats.count > column.wipLimit * 0.8;
  const isBlocked = column.id === 'blocked';

  const getColumnStyle = () => {
    if (isBlocked) return 'bg-destructive/5';
    if (stats.isBottleneck) return 'bg-amber-500/5';
    return 'bg-card';
  };

  const getHeaderColor = () => {
    if (isOverLimit) return 'text-destructive';
    if (isNearLimit || stats.isBottleneck) return 'text-amber-600 dark:text-amber-400';
    if (stats.count === 0) return 'text-green-600 dark:text-green-400';
    return 'text-foreground';
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border border-border overflow-hidden transition-all',
        isMobile ? 'w-full' : 'w-[280px] sm:w-[320px] shrink-0',
        getColumnStyle()
      )}
    >
      <div className="p-3 sm:p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className={cn('font-semibold text-sm sm:text-base', getHeaderColor())}>
            {column.title}
          </h3>
          
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-xs sm:text-sm font-bold',
              isOverLimit && 'text-destructive',
              isNearLimit && !isOverLimit && 'text-amber-600'
            )}>
              {stats.count}
              {enforceWIP && column.wipLimit < 999 && (
                <span className="text-muted-foreground font-normal">
                  {' '}/ {column.wipLimit}
                </span>
              )}
            </span>
            
            {(isOverLimit || stats.isBottleneck) && (
              <AlertTriangle className={cn(
                'w-4 h-4',
                isOverLimit ? 'text-destructive' : 'text-amber-500'
              )} />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground">
          <span>
            Avg: <span className="font-medium text-foreground">{stats.avgDays.toFixed(1)}d</span>
          </span>
          
          {stats.isBottleneck && (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              ⚠️ Bottleneck
            </span>
          )}
          
          {isBlocked && tasks.length === 0 && (
            <span className="text-green-600 dark:text-green-400 font-medium">
              ✓ Clear
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 scrollbar-hide">
        {tasks.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-muted-foreground text-xs sm:text-sm">
            {isBlocked ? (
              <>
                <div className="font-medium text-green-600 dark:text-green-400 mb-1">
                  No blocked tasks
                </div>
                <div>Flow is healthy</div>
              </>
            ) : column.id === 'done' ? (
              <>
                <div className="font-medium mb-1">Execution complete</div>
                <div>Nothing finished yet</div>
              </>
            ) : (
              <>
                <div className="font-medium mb-1">No tasks here</div>
                <div>
                  {column.id === 'backlog' ? 'Add tasks to get started' : 'Flow is healthy'}
                </div>
              </>
            )}
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              isBlocked={isBlocked}
            />
          ))
        )}
      </div>
    </div>
  );
}