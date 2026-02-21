import { useActivityTrends, useAnalyticsOverview, useMemberContribution, useProjectHealth, useTaskTrends, useTimeSummary, useWorkload } from "./useAnalytics";

interface UseAnalyticsPageProps {
    workspaceId: string;
}
export function useAnalyticsPage({workspaceId}: UseAnalyticsPageProps) {
    
  // Fetch all analytics data
  const { data: overview, isLoading: overviewLoading, error: overviewError } = 
    useAnalyticsOverview(workspaceId);
  
  const { data: taskTrends, isLoading: trendsLoading } = 
    useTaskTrends(workspaceId, 30);
  
  const { data: projectHealth, isLoading: projectsLoading } = 
    useProjectHealth(workspaceId);
  
  const { data: memberContribution, isLoading: membersLoading } = 
    useMemberContribution(workspaceId);
  
  const { data: timeSummary, isLoading: timeLoading } = 
    useTimeSummary(workspaceId, 7);
  
  const { data: activityTrends, isLoading: activityLoading } = 
    useActivityTrends(workspaceId, 30);
  
  const { data: workload, isLoading: workloadLoading } = 
    useWorkload(workspaceId);

  const isLoading = overviewLoading || trendsLoading || projectsLoading || 
    membersLoading || timeLoading || activityLoading || workloadLoading;

    const errorMessage =
      (overviewError as any)?.response?.data?.message ||
      (overviewError as any)?.message ||
      'Failed to load analytics';

    const isAccessDenied =
      errorMessage.includes('restricted') ||
      errorMessage.includes('access') ||
      (overviewError as any)?.response?.status === 403;

    return {
        overview,
        overviewError,
        taskTrends,
        projectHealth,
        memberContribution,
        timeSummary,
        activityTrends,
        workload,
        isLoading,
        overviewLoading,
        isAccessDenied,
        errorMessage
    }
}