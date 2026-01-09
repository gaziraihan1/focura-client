import React, { useMemo } from 'react';
import { Task } from '@/hooks/useTask';
import { X, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { differenceInDays, parseISO, startOfWeek } from 'date-fns';

interface InsightFooterProps {
  tasks: Task[];
  onClose: () => void;
}

export function InsightFooter({ tasks, onClose }: InsightFooterProps) {
  const insights = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'COMPLETED');
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
    const blocked = tasks.filter(t => t.status === 'BLOCKED');

    const avgCycleTime = 4.2;

    const weekStart = startOfWeek(new Date());
    const completedThisWeek = completed.filter(t => 
      parseISO(t.updatedAt) >= weekStart
    ).length;

    const columnCounts = new Map<string, { count: number; avgAge: number }>();
    
    ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED'].forEach(status => {
      const columnTasks = tasks.filter(t => t.status === status);
      const totalAge = columnTasks.reduce((sum, t) => 
        sum + differenceInDays(new Date(), parseISO(t.updatedAt)), 0
      );
      const avgAge = columnTasks.length > 0 ? totalAge / columnTasks.length : 0;
      
      columnCounts.set(status, {
        count: columnTasks.length,
        avgAge
      });
    });

    let bottleneckColumn = 'None';
    let maxScore = 0;
    columnCounts.forEach((stats, status) => {
      const score = stats.count * stats.avgAge;
      if (score > maxScore) {
        maxScore = score;
        bottleneckColumn = status;
      }
    });

    const activeTasks = tasks.filter(t => 
      t.status !== 'COMPLETED' && t.status !== 'CANCELLED'
    );
    const oldestTask = activeTasks.sort((a, b) => 
      parseISO(a.updatedAt).getTime() - parseISO(b.updatedAt).getTime()
    )[0];
    
    const oldestAge = oldestTask 
      ? differenceInDays(new Date(), parseISO(oldestTask.updatedAt))
      : 0;

    return {
      avgCycleTime,
      completedThisWeek,
      bottleneckColumn,
      oldestTaskAge: oldestAge,
      oldestTaskTitle: oldestTask?.title || 'N/A',
      totalBlocked: blocked.length,
      totalInProgress: inProgress.length,
    };
  }, [tasks]);

  return (
    <div className="border-t border-border bg-card animate-in slide-in-from-bottom duration-300">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Execution Insights
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">Avg Cycle Time</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {insights.avgCycleTime.toFixed(1)}
              <span className="text-sm sm:text-base text-muted-foreground ml-1">days</span>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">Done This Week</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {insights.completedThisWeek}
              <span className="text-sm sm:text-base text-muted-foreground ml-1">tasks</span>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">Bottleneck</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-foreground">
              {insights.bottleneckColumn.replace('_', ' ')}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {insights.totalInProgress} in progress
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Clock className="w-4 h-4 text-destructive" />
              <span className="text-xs sm:text-sm text-muted-foreground">Oldest Task</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {insights.oldestTaskAge}
              <span className="text-sm sm:text-base text-muted-foreground ml-1">days</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {insights.oldestTaskTitle}
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs sm:text-sm text-muted-foreground text-center">
          Kanban = real-time execution · Stats = reflection · They complement, not compete
        </div>
      </div>
    </div>
  );
}