"use client";

import { BarChart3, Loader2, AlertTriangle } from "lucide-react";
import { ProjectKPICards } from "./ProjectKPICards";
import { ProjectTaskStatusChart } from "./ProjectTaskStatusChart";
import { ProjectCompletionTrendChart } from "./ProjectCompletionTrend";
import { ProjectPriorityDistribution } from "./ProjectPriorityDistribution";
import { ProjectDeadlineRiskPanel } from "./ProjectDeadlineRiskPanel";
import { ProjectMemberLeaderboard } from "./ProjectMemberLeaderboard";
import { useProjectAnalyticsPage } from "@/hooks/useProjectAnalyticsPage";

interface ProjectAnalyticsPageProps {
  workspaceId: string;
  projectId: string;
  projectName: string;
  projectColor: string;
}

export function ProjectAnalyticsPage({
  workspaceId,
  projectId,
  projectName,
  projectColor,
}: ProjectAnalyticsPageProps) {
  const {
    overview,
    overviewLoading,
    overviewError,
    isAccessDenied,
    errorMessage,
    completionTrend,
    memberContribution,
    deadlineRisk,
    isLoading,
  } = useProjectAnalyticsPage({ workspaceId, projectId });

  if (overviewLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading project analytics...</p>
        </div>
      </div>
    );
  }

  if (overviewError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <AlertTriangle
            className={`w-12 h-12 ${
              isAccessDenied ? "text-amber-500" : "text-destructive"
            }`}
          />
          <div>
            <h3 className="text-lg font-semibold">
              {isAccessDenied ? "Access Restricted" : "Failed to load analytics"}
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

  if (!overview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 mx-auto text-center max-w-md">
          <BarChart3 className="w-12 h-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">No Analytics Data</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Analytics data is not available for this project.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 px-2 sm:px-4 lg:px-0 mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${projectColor}18` }}
            >
              <BarChart3 className="w-6 h-6" style={{ color: projectColor }} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{projectName} Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Project-level insights and performance metrics
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProjectKPICards kpis={overview.kpis!} accentColor={projectColor} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectTaskStatusChart data={overview.taskStatus || []} />
        {completionTrend && <ProjectCompletionTrendChart data={completionTrend} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectPriorityDistribution data={overview.priority || []} />
        {deadlineRisk && <ProjectDeadlineRiskPanel data={deadlineRisk} />}
      </div>

      {memberContribution && memberContribution.length > 0 && (
        <ProjectMemberLeaderboard data={memberContribution} />
      )}

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