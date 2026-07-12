"use client";

import { useMemo } from "react";
import {
  useProjectAnalyticsOverview,
  useProjectCompletionTrend,
  useProjectMemberContribution,
  useProjectTimeSummary,
  useProjectDeadlineRisk,
} from "./useProjectAnalytics";
import { normalizeError } from "@/lib/axios";

interface UseProjectAnalyticsPageParams {
  workspaceId: string;
  projectId: string;
}

export function useProjectAnalyticsPage({ workspaceId, projectId }: UseProjectAnalyticsPageParams) {
  const {
    data: overview,
    isPending: overviewPending,
    isFetching: overviewFetching,
    error: overviewError,
  } = useProjectAnalyticsOverview(workspaceId, projectId);

  const overviewLoading = overviewPending || overviewFetching;

  const normalizedError = useMemo(() => {
    return overviewError ? normalizeError(overviewError) : null;
  }, [overviewError]);

  const hasNotPlan = useMemo(() => {
    if (!normalizedError) return false;
    return (
      normalizedError.status === 403 &&
      normalizedError.message.toLowerCase().includes("upgrade workspace plan")
    );
  }, [normalizedError]);

  const isAccessDenied = useMemo(() => {
    if (!normalizedError) return false;
    return (
      normalizedError.status === 403 &&
      normalizedError.message.toLowerCase().includes("permission")
    );
  }, [normalizedError]);

  const canRunAnalytics = useMemo(() => {
    return !!workspaceId && !!projectId && !overviewLoading && !hasNotPlan && !isAccessDenied;
  }, [workspaceId, projectId, overviewLoading, hasNotPlan, isAccessDenied]);

  const { data: completionTrend, isPending: trendsPending } = useProjectCompletionTrend(
    workspaceId,
    projectId,
    30,
    { enabled: canRunAnalytics }
  );

  const { data: memberContribution, isPending: membersPending } = useProjectMemberContribution(
    workspaceId,
    projectId,
    { enabled: canRunAnalytics }
  );

  const { data: timeSummary, isPending: timePending } = useProjectTimeSummary(
    workspaceId,
    projectId,
    7,
    { enabled: canRunAnalytics }
  );

  const { data: deadlineRisk, isPending: riskPending } = useProjectDeadlineRisk(
    workspaceId,
    projectId,
    { enabled: canRunAnalytics }
  );

  const isLoading = useMemo(() => {
    return canRunAnalytics && (trendsPending || membersPending || timePending || riskPending);
  }, [canRunAnalytics, trendsPending, membersPending, timePending, riskPending]);

  const errorMessage = useMemo(() => {
    if (!normalizedError) return "";

    if (isAccessDenied) {
      return "You do not have permission to view analytics for this project.";
    }

    if (hasNotPlan) {
      return "Your current plan does not include analytics. Please upgrade your workspace plan to access analytics features.";
    }

    return normalizedError.message || "An unexpected error occurred while loading analytics.";
  }, [normalizedError, isAccessDenied, hasNotPlan]);

  return {
    overview,
    overviewLoading,
    overviewError: normalizedError,
    isAccessDenied,
    hasNotPlan,
    errorMessage,
    completionTrend,
    memberContribution,
    timeSummary,
    deadlineRisk,
    isLoading,
  };
}