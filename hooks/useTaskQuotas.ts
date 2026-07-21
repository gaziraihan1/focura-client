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
    staleTime: 0,
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
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
    staleTime: 0,
    refetchInterval: 20 * 1000,
    refetchIntervalInBackground: false,
  });
}
