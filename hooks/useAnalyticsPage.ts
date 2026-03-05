"use client";

import { useMemo } from "react";
import {
  useAnalyticsOverview,
  useTaskTrends,
  useProjectHealth,
  useMemberContribution,
  useTimeSummary,
  useActivityTrends,
  useWorkload,
} from "./useAnalytics";

interface UseAnalyticsPageParams {
  workspaceId: string;
}

export function useAnalyticsPage({ workspaceId }: UseAnalyticsPageParams) {
  const {
    data: overview,
    isPending: overviewPending,
    isFetching: overviewFetching,
    error: overviewError,
  } = useAnalyticsOverview(workspaceId);

  const { data: taskTrends, isPending: trendsPending } = useTaskTrends(
    workspaceId,
    30,
  );
  const { data: projectHealth, isPending: projectsPending } =
    useProjectHealth(workspaceId);
  const { data: memberContribution, isPending: membersPending } =
    useMemberContribution(workspaceId);
  const { data: timeSummary, isPending: timePending } = useTimeSummary(
    workspaceId,
    7,
  );
  const { data: activityTrends, isPending: activityPending } =
    useActivityTrends(workspaceId, 30);
  const { data: workload, isPending: workloadPending } =
    useWorkload(workspaceId);

  const overviewLoading = overviewPending || overviewFetching;

  const isLoading =
    trendsPending ||
    projectsPending ||
    membersPending ||
    timePending ||
    activityPending ||
    workloadPending;

  const isAccessDenied = useMemo(() => {
    if (!overviewError) return false;
    const error = overviewError as any;
    return (
      error?.response?.status === 403 ||
      error?.message?.toLowerCase().includes("access") ||
      error?.message?.toLowerCase().includes("permission")
    );
  }, [overviewError]);

  const errorMessage = useMemo(() => {
    if (!overviewError) return "";
    const error = overviewError as any;
    if (isAccessDenied) {
      return "You do not have permission to view analytics for this workspace.";
    }
    return (
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred while loading analytics."
    );
  }, [overviewError, isAccessDenied]);

  return {
    overview,
    taskTrends,
    projectHealth,
    memberContribution,
    timeSummary,
    activityTrends,
    workload,

    overviewLoading,
    isLoading,

    overviewError,
    isAccessDenied,
    errorMessage,
  };
}
