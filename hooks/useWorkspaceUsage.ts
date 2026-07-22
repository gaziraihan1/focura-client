import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { WorkspaceUsageData, DateRangeFilter } from '@/types/workspace-usage.types';

interface UseWorkspaceUsageOptions {
  enabled?: boolean;
  dateRange?: DateRangeFilter;
}

export const workspaceUsageKeys = {
  all: ['workspace-usage'] as const,
  detail: (workspaceId: string, dateRange: DateRangeFilter) =>
    [...workspaceUsageKeys.all, workspaceId, dateRange] as const,
};

export function useWorkspaceUsage(
  workspaceId: string | undefined,
  options: UseWorkspaceUsageOptions = {}
) {
  const { enabled = true, dateRange = '30d' } = options;

  return useQuery({
    queryKey: workspaceUsageKeys.detail(workspaceId ?? '', dateRange),
    queryFn: async () => {
      if (!workspaceId) throw new Error('Workspace ID is required');

      const response = await api.get<WorkspaceUsageData>(
        `/api/v1/workspace-usage/${workspaceId}/usage`,
        { params: { dateRange } }
      );

      return response.data;
    },
    enabled: !!workspaceId && enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useExportWorkspaceUsage() {
  const queryClient = useQueryClient();

  const exportToCSV = async (workspaceId: string, dateRange: DateRangeFilter) => {
    const data = queryClient.getQueryData<WorkspaceUsageData>(
      workspaceUsageKeys.detail(workspaceId, dateRange)
    );

    if (!data) {
      throw new Error('No data available for export');
    }

    const rows: string[] = [];
    rows.push('Section,Metric,Value');

    // Snapshot
    rows.push(`Overview,Total Members,${data.snapshot.totalMembers}`);
    rows.push(`Overview,Active Members,${data.snapshot.activeMembers}`);
    rows.push(`Overview,Total Tasks,${data.snapshot.totalTasks}`);
    rows.push(`Overview,Total Projects,${data.snapshot.totalProjects}`);
    rows.push(`Overview,Storage Used (MB),${data.snapshot.storageUsedMB}`);
    rows.push(`Overview,Activity Events,${data.snapshot.activityEvents}`);
    rows.push(`Overview,Avg Daily Users,${data.snapshot.avgDailyUsers}`);
    rows.push(`Overview,Engagement Score,${data.snapshot.engagementScore}%`);

    // Feature Usage
    rows.push(`Feature Usage,Tasks Created,${data.featureUsage.tasksCreated}`);
    rows.push(`Feature Usage,Comments Added,${data.featureUsage.commentsAdded}`);
    rows.push(`Feature Usage,Time Entries Logged,${data.featureUsage.timeEntriesLogged}`);
    rows.push(`Feature Usage,Files Uploaded,${data.featureUsage.filesUploaded}`);
    rows.push(`Feature Usage,Mentions Used,${data.featureUsage.mentionsUsed}`);

    // Plan Limits
    rows.push(`Plan Limits,Current Plan,${data.planLimits.currentPlan}`);
    rows.push(`Plan Limits,Member Count,${data.planLimits.memberCount}/${data.planLimits.memberLimit}`);
    rows.push(`Plan Limits,Storage,${data.planLimits.storageUsedMB}/${data.planLimits.storageLimitMB} MB`);
    rows.push(`Plan Limits,Projects,${data.planLimits.projectCount}/${data.planLimits.projectLimit}`);

    // Growth
    rows.push(`Growth,New Users (This Month),${data.workspaceGrowth.thisMonth.newUsers}`);
    rows.push(`Growth,New Projects (This Month),${data.workspaceGrowth.thisMonth.newProjects}`);
    rows.push(`Growth,New Tasks (This Month),${data.workspaceGrowth.thisMonth.newTasks}`);

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workspace-usage-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return { exportToCSV };
}
