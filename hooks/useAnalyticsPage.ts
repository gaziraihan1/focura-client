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
import { normalizeError } from "@/lib/axios";

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
    30
  );
  const { data: projectHealth, isPending: projectsPending } =
    useProjectHealth(workspaceId);
  const { data: memberContribution, isPending: membersPending } =
    useMemberContribution(workspaceId);
  const { data: timeSummary, isPending: timePending } = useTimeSummary(
    workspaceId,
    7
  );
  const { data: activityTrends, isPending: activityPending } =
    useActivityTrends(workspaceId, 30);
  const { data: workload, isPending: workloadPending } =
    useWorkload(workspaceId);

  // 🔥 Normalize error ONCE (correct pattern)
  const normalizedError = useMemo(() => {
    return overviewError ? normalizeError(overviewError) : null;
  }, [overviewError]);

  const overviewLoading = overviewPending || overviewFetching;

  const isLoading =
    trendsPending ||
    projectsPending ||
    membersPending ||
    timePending ||
    activityPending ||
    workloadPending;

  const isAccessDenied = useMemo(() => {
    if (!normalizedError) return false;

    return (
      normalizedError.status === 403 ||
      normalizedError.message.toLowerCase().includes("access") ||
      normalizedError.message.toLowerCase().includes("permission")
    );
  }, [normalizedError]);

  const errorMessage = useMemo(() => {
    if (!normalizedError) return "";

    if (isAccessDenied) {
      return "You do not have permission to view analytics for this workspace.";
    }

    return (
      normalizedError.message ||
      "An unexpected error occurred while loading analytics."
    );
  }, [normalizedError, isAccessDenied]);

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

    overviewError: normalizedError, // ✅ return normalized version
    isAccessDenied,
    errorMessage,
  };
}