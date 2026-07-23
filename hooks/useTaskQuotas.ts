import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { PersonalQuotaInfo, WorkspaceQuotaInfo } from "./useTask";
import { taskKeys } from "./taskKeys";

function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date();
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function getSmartRefetchInterval(hasChanges: boolean): number {
  // If there are recent changes, poll more frequently
  // Otherwise, use a longer interval to reduce network traffic
  if (hasChanges) {
    return 15 * 1000; // 15 seconds when actively using tasks
  }
  return 60 * 1000; // 60 seconds when idle
}

export function usePersonalQuota() {
  const qc = useQueryClient();

  useQuery({
    queryKey: [...taskKeys.personalQuota(), "__midnight_reset__"],
    queryFn: () => null,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchInterval: () => {
      const ms = msUntilMidnight();
      setTimeout(() => { qc.invalidateQueries({ queryKey: taskKeys.personalQuota() }); }, ms);
      return false;
    },
  });

  return useQuery({
    queryKey: taskKeys.personalQuota(),
    queryFn: async (): Promise<PersonalQuotaInfo> => {
      const response = await api.get<PersonalQuotaInfo>("/api/v1/tasks/quota/personal", { showErrorToast: true });
      return response?.data as PersonalQuotaInfo;
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: (query) => {
      // Smart polling: check if quota was recently used
      const data = query.state.data;
      if (!data) return 30 * 1000;

      // If user has used tasks recently (within last 5 minutes), poll more frequently
      const resetTime = new Date(data.resetAt).getTime();
      const now = Date.now();
      const hoursUntilReset = (resetTime - now) / (1000 * 60 * 60);

      // If reset is within 2 hours, poll more frequently
      if (hoursUntilReset < 2) {
        return 10 * 1000;
      }

      // Normal polling interval
      return 60 * 1000;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useWorkspaceQuota(workspaceId: string | undefined) {
  const qc = useQueryClient();

  useQuery({
    queryKey: workspaceId ? [...taskKeys.workspaceQuota(workspaceId), "__midnight_reset__"] : ["__noop__"],
    queryFn: () => null,
    enabled: !!workspaceId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchInterval: () => {
      if (!workspaceId) return false;
      const ms = msUntilMidnight();
      setTimeout(() => { qc.invalidateQueries({ queryKey: taskKeys.workspaceQuota(workspaceId!) }); }, ms);
      return false;
    },
  });

  return useQuery({
    queryKey: workspaceId ? taskKeys.workspaceQuota(workspaceId) : ["__disabled__"],
    queryFn: async (): Promise<WorkspaceQuotaInfo> => {
      const response = await api.get<WorkspaceQuotaInfo>(`/api/v1/tasks/quota/workspace/${workspaceId}`, { showErrorToast: true });
      return response?.data as WorkspaceQuotaInfo;
    },
    enabled: !!workspaceId,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 20 * 1000;

      // If workspace is near quota limit, poll more frequently
      const isNearLimit = data.workspaceRemaining !== null && data.dailyWorkspaceLimit !== null
        && data.workspaceRemaining < data.dailyWorkspaceLimit * 0.2;
      if (isNearLimit) {
        return 10 * 1000;
      }

      // If quota is unlimited, poll less frequently
      if (data.isUnlimited) {
        return 120 * 1000; // 2 minutes
      }

      // Normal polling based on remaining quota
      const remainingPct = data.workspaceRemaining !== null && data.dailyWorkspaceLimit
        ? data.workspaceRemaining / data.dailyWorkspaceLimit
        : 1;

      if (remainingPct < 0.2) {
        // Less than 20% remaining - poll more frequently
        return 15 * 1000;
      }

      return 60 * 1000;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useInvalidateQuotaOnTaskCreate() {
  const qc = useQueryClient();

  return () => {
    qc.invalidateQueries({ queryKey: taskKeys.personalQuota() });
    qc.invalidateQueries({ queryKey: taskKeys.quotas() });
  };
}
