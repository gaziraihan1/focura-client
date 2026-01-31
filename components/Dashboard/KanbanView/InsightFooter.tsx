import React from 'react';
import { Task } from '@/hooks/useTask';
import { X, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useKanbanInsightFooter } from '@/hooks/useKanbanInsightFooter';

interface InsightFooterProps {
  tasks: Task[];
  onClose: () => void;
}

export function InsightFooter({ tasks, onClose }: InsightFooterProps) {
  const controller = useKanbanInsightFooter({tasks})

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
              {controller.insights.avgCycleTime.toFixed(1)}
              <span className="text-sm sm:text-base text-muted-foreground ml-1">days</span>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">Done This Week</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {controller.insights.completedThisWeek}
              <span className="text-sm sm:text-base text-muted-foreground ml-1">tasks</span>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">Bottleneck</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-foreground">
              {controller.insights.bottleneckColumn.replace('_', ' ')}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {controller.insights.totalInProgress} in progress
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Clock className="w-4 h-4 text-destructive" />
              <span className="text-xs sm:text-sm text-muted-foreground">Oldest Task</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {controller.insights.oldestTaskAge}
              <span className="text-sm sm:text-base text-muted-foreground ml-1">days</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {controller.insights.oldestTaskTitle}
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