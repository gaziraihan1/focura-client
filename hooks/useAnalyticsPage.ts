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
  // -------------------------------
  // Overview (SOURCE OF TRUTH)
  // -------------------------------
  const {
    data: overview,
    isPending: overviewPending,
    isFetching: overviewFetching,
    error: overviewError,
  } = useAnalyticsOverview(workspaceId);

  const overviewLoading = overviewPending || overviewFetching;

  // -------------------------------
  // Normalize error once
  // -------------------------------
  const normalizedError = useMemo(() => {
    return overviewError ? normalizeError(overviewError) : null;
  }, [overviewError]);

  // -------------------------------
  // Plan / Permission detection
  // -------------------------------
  const hasNotPlan = useMemo(() => {
    if (!normalizedError) return false;

    return (
      normalizedError.status === 403 &&
      normalizedError.message
        .toLowerCase()
        .includes("upgrade workspace plan")
    );
  }, [normalizedError]);

  const isAccessDenied = useMemo(() => {
    if (!normalizedError) return false;

    return (
      normalizedError.status === 403 &&
      normalizedError.message.toLowerCase().includes("permission")
    );
  }, [normalizedError]);

  // -------------------------------
  // Gate ALL other queries
  // -------------------------------
  const canRunAnalytics = useMemo(() => {
    return !!workspaceId && !overviewLoading && !hasNotPlan && !isAccessDenied;
  }, [workspaceId, overviewLoading, hasNotPlan, isAccessDenied]);

  // -------------------------------
  // Dependent Queries (GATED)
  // -------------------------------
  const { data: taskTrends, isPending: trendsPending } = useTaskTrends(
    workspaceId,
    30,
    { enabled: canRunAnalytics }
  );

  const { data: projectHealth, isPending: projectsPending } =
    useProjectHealth(workspaceId, {
      enabled: canRunAnalytics,
    });

  const { data: memberContribution, isPending: membersPending } =
    useMemberContribution(workspaceId, {
      enabled: canRunAnalytics,
    });

  const { data: timeSummary, isPending: timePending } = useTimeSummary(
    workspaceId,
    7,
    { enabled: canRunAnalytics }
  );

  const { data: activityTrends, isPending: activityPending } =
    useActivityTrends(workspaceId, 30, {
      enabled: canRunAnalytics,
    });

  const { data: workload, isPending: workloadPending } =
    useWorkload(workspaceId, {
      enabled: canRunAnalytics,
    });

  // -------------------------------
  // Global loading state
  // -------------------------------
  const isLoading =
    canRunAnalytics &&
    (trendsPending ||
      projectsPending ||
      membersPending ||
      timePending ||
      activityPending ||
      workloadPending);

  // -------------------------------
  // Error message mapping
  // -------------------------------
  const errorMessage = useMemo(() => {
    if (!normalizedError) return "";

    if (isAccessDenied) {
      return "You do not have permission to view analytics for this workspace.";
    }

    if (hasNotPlan) {
      return "Your current plan does not include analytics. Please upgrade your workspace plan to access analytics features.";
    }

    return (
      normalizedError.message ||
      "An unexpected error occurred while loading analytics."
    );
  }, [normalizedError, isAccessDenied, hasNotPlan]);

  return {
    overview,
    hasNotPlan,

    taskTrends,
    projectHealth,
    memberContribution,
    timeSummary,
    activityTrends,
    workload,

    overviewLoading,
    isLoading,

    overviewError: normalizedError,
    isAccessDenied,
    errorMessage,
  };
}