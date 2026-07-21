import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Workspace, CreateWorkspaceDto } from "./useWorkspace";
import { workspaceKeys } from "./workspaceKeys";
import { analyticsKeys } from "./useAnalytics";

export function useCreateWorkspace() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation<Workspace, unknown, CreateWorkspaceDto>({
    mutationFn: async (data): Promise<Workspace> => {
      const response = await api.post<Workspace>("/api/v1/workspaces", data, { showErrorToast: true, showSuccessToast: true });
      return response.data as Workspace;
    },
    onSuccess: (workspace) => {
      qc.invalidateQueries({ queryKey: workspaceKeys.lists() });
      if (workspace?.slug) router.push(`/dashboard/workspaces/${workspace.slug}`);
    },
  });
}

export function useUpdateWorkspace() {
  const qc = useQueryClient();

  return useMutation<Workspace, unknown, { id: string; data: Partial<CreateWorkspaceDto> }>({
    mutationFn: async ({ id, data }): Promise<Workspace> => {
      const response = await api.put<Workspace>(`/api/v1/workspaces/${id}`, data, { showSuccessToast: true, showErrorToast: true });
      return response.data as Workspace;
    },
    onSuccess: (workspace) => {
      if (workspace.slug) {
        qc.setQueryData(workspaceKeys.detail(workspace.slug), workspace);
      }
      qc.invalidateQueries({ queryKey: workspaceKeys.lists() });
      qc.invalidateQueries({ queryKey: workspaceKeys.overview(workspace.slug) });
      qc.invalidateQueries({ queryKey: analyticsKeys.all(workspace.id) });
    },
  });
}

export function useDeleteWorkspace() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/v1/workspaces/${id}`, { showSuccessToast: true, showErrorToast: true });
      return response;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workspaceKeys.lists() });
      router.push("/dashboard/workspaces");
    },
  });
}

export function useInviteMember() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, email, role }: { workspaceId: string; email: string; role: "OWNER" | "ADMIN" | "MEMBER" | "GUEST" }) => {
      const response = await api.post(`/api/v1/workspaces/${workspaceId}/invite`, { email, role }, { showSuccessToast: true, showErrorToast: true });
      return response.data;
    },
    onSuccess: (_, { workspaceId }) => {
      qc.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) });
    },
  });
}

export function useRemoveMember() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, memberId }: { workspaceId: string; memberId: string }) => {
      const response = await api.delete(`/api/v1/workspaces/${workspaceId}/members/${memberId}`, { showSuccessToast: true, showErrorToast: true });
      return response.data;
    },
    onSuccess: (_, { workspaceId }) => {
      qc.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) });
    },
  });
}

export function useUpdateMemberRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, memberId, role }: { workspaceId: string; memberId: string; role: "OWNER" | "ADMIN" | "MEMBER" | "GUEST" }) => {
      const response = await api.put(`/api/v1/workspaces/${workspaceId}/members/${memberId}/role`, { role }, { showSuccessToast: true, showErrorToast: true });
      return response.data;
    },
    onSuccess: (_, { workspaceId }) => {
      qc.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) });
    },
  });
}

export function useAcceptInvitation() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation<Workspace, unknown, string>({
    mutationFn: async (token): Promise<Workspace> => {
      const response = await api.post<Workspace>(`/api/v1/workspaces/invitations/${token}/accept`, {}, { showSuccessToast: true, showErrorToast: true });
      return response.data as Workspace;
    },
    onSuccess: (workspace) => {
      qc.invalidateQueries({ queryKey: workspaceKeys.lists() });
      if (workspace.slug) router.push(`/dashboard/${workspace.slug}`);
    },
  });
}

export function useLeaveWorkspace() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await api.post(`/api/v1/workspaces/${workspaceId}/leave`, {}, { showSuccessToast: true, showErrorToast: true });
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workspaceKeys.lists() });
      router.push("/dashboard/workspaces");
    },
  });
}
