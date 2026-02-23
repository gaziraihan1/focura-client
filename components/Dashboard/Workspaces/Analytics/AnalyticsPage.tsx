'use client';

import { BarChart3, Loader2, AlertTriangle } from 'lucide-react';
import { KPICards } from './KPICards';
import { TaskStatusChart } from './TaskStatusChart';
import { TaskCompletionTrend } from './TaskCompletionTrend';
import { MemberLeaderboard } from './MemberLeaderboard';
import { DeadlineRiskPanel } from './DeadlineRiskPanel';
import { ProjectHealthCards } from './ProjectHealthCards';
import { ActivityTrendChart } from './ActivityTrendChart';
import { WorkloadChart } from './WorkloadChart';
import { MostActiveDay } from './MostActiveDay';
import { TimeSummaryCard } from './TimeSummaryCard';
import { PriorityDistribution } from './PriorityDistribution';
import { AnalyticsWorkspaceSwitcher } from './AnalyticsWorkspaceSwitcher';
import { useAnalyticsPage } from '@/hooks/useAnalyticsPage';

interface AnalyticsPageProps {
  workspaceId: string;
  selectedWorkspaceId?: string;
  setSelectedWorkspaceId?: (id: string) => void;
}

export function AnalyticsPage({
  workspaceId,
  selectedWorkspaceId,
  setSelectedWorkspaceId,
}: AnalyticsPageProps) {
  const {
    overview,
    overviewError,
    overviewLoading,
    taskTrends,
    projectHealth,
    workload,
    activityTrends,
    memberContribution,
    timeSummary,
    isLoading,
    isAccessDenied,
    errorMessage,
  } = useAnalyticsPage({ workspaceId });

  // Loading state
  if (overviewLoading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Error state - check for 403 access denied
  if (overviewError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <AlertTriangle
            className={`w-12 h-12 ${
              isAccessDenied ? 'text-amber-500' : 'text-destructive'
            }`}
          />
          <div>
            <h3 className="text-lg font-semibold">
              {isAccessDenied ? 'Access Restricted' : 'Failed to load analytics'}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">{errorMessage}</p>
            {isAccessDenied && (
              <p className="text-xs text-muted-foreground mt-2">
                Contact your workspace admin to request analytics access.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!overview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <BarChart3 className="w-12 h-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">No Analytics Data</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Analytics data is not available for this workspace.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive workspace insights and metrics
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Switcher - only show if props provided */}
        {selectedWorkspaceId && setSelectedWorkspaceId && (
          <AnalyticsWorkspaceSwitcher
            currentWorkspaceId={selectedWorkspaceId}
            onWorkspaceChange={setSelectedWorkspaceId}
          />
        )}
      </div>

      {/* Executive KPIs */}
      <KPICards kpis={overview.kpis} />

      {/* Task Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskStatusChart data={overview.taskStatus} />
        {taskTrends && <TaskCompletionTrend data={taskTrends.completionTrend} />}
      </div>

      {/* Priority & Project Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityDistribution data={overview.tasksByPriority} />
        {projectHealth && projectHealth.length > 0 && (
          <ProjectHealthCards data={projectHealth} />
        )}
      </div>

      {/* Member Leaderboard */}
      {memberContribution && memberContribution.length > 0 && (
        <MemberLeaderboard data={memberContribution} />
      )}

      {/* Activity & Workload Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activityTrends && <ActivityTrendChart data={activityTrends.volumeTrend} />}
        {workload && workload.length > 0 && <WorkloadChart data={workload} />}
      </div>

      {/* Time Summary & Most Active Day Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {timeSummary && (
          <div className="lg:col-span-2">
            <TimeSummaryCard data={timeSummary} days={7} />
          </div>
        )}
        {activityTrends && (
          <div className="lg:col-span-1">
            <MostActiveDay data={activityTrends.mostActiveDay} />
          </div>
        )}
      </div>

      {/* Deadline Risk Panel */}
      <DeadlineRiskPanel data={overview.deadlineRisk} />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center gap-3 px-6 py-4 bg-card border rounded-lg shadow-lg">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Updating analytics...</span>
          </div>
        </div>
      )}
    </div>
  );
}