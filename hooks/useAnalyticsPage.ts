'use client';

import { useMemo } from 'react';
import {
  useAnalyticsOverview,
  useTaskTrends,
  useProjectHealth,
  useMemberContribution,
  useTimeSummary,
  useActivityTrends,
  useWorkload,
} from './useAnalytics';

interface UseAnalyticsPageParams {
  workspaceId: string;
}

export function useAnalyticsPage({ workspaceId }: UseAnalyticsPageParams) {
  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
  } = useAnalyticsOverview(workspaceId);

  const { data: taskTrends, isLoading: trendsLoading } = useTaskTrends(
    workspaceId,
    30
  );

  const { data: projectHealth, isLoading: projectsLoading } =
    useProjectHealth(workspaceId);

  const { data: memberContribution, isLoading: membersLoading } =
    useMemberContribution(workspaceId);

  const { data: timeSummary, isLoading: timeLoading } = useTimeSummary(
    workspaceId,
    7
  );

  const { data: activityTrends, isLoading: activityLoading } =
    useActivityTrends(workspaceId, 30);

  const { data: workload, isLoading: workloadLoading } =
    useWorkload(workspaceId);

  const isLoading =
    overviewLoading ||
    trendsLoading ||
    projectsLoading ||
    membersLoading ||
    timeLoading ||
    activityLoading ||
    workloadLoading;

  const isAccessDenied = useMemo(() => {
    if (!overviewError) return false;
    
    const error = overviewError as any;
    return (
      error?.response?.status === 403 ||
      error?.message?.toLowerCase().includes('access') ||
      error?.message?.toLowerCase().includes('permission')
    );
  }, [overviewError]);

  const errorMessage = useMemo(() => {
    if (!overviewError) return '';

    const error = overviewError as any;

    if (isAccessDenied) {
      return 'You do not have permission to view analytics for this workspace.';
    }

    return (
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred while loading analytics.'
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
    trendsLoading,
    projectsLoading,
    membersLoading,
    timeLoading,
    activityLoading,
    workloadLoading,
    isLoading,

    overviewError,
    isAccessDenied,
    errorMessage,
  };
}