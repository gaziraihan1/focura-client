import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ProjectDetails, CreateProjectDto, UpdateProjectDto, AddProjectMemberDto, ProjectMember } from "./useProjects";
import { projectKeys } from "./projectKeys";

function unwrap<T>(response: any): T {
  if (response && typeof response === "object" && "success" in response && "data" in response) {
    return response.data as T;
  }
  return response as T;
}

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProjectDto) => {
      const res = await api.post<ProjectDetails>("/api/v1/projects", data, { showSuccessToast: true, showErrorToast: true });
      return unwrap<ProjectDetails>(res);
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: projectKeys.list(variables.workspaceId) });
    },
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, data }: { projectId: string; data: UpdateProjectDto }) => {
      const res = await api.patch<ProjectDetails>(`/api/v1/projects/${projectId}`, data, { showSuccessToast: true, showErrorToast: true });
      return unwrap<ProjectDetails>(res);
    },
    onSuccess: (updatedProject) => {
      if (updatedProject.slug) {
        qc.setQueryData<ProjectDetails>([...projectKeys.details(), "slug", updatedProject.slug], (old) => (old ? { ...old, ...updatedProject } : updatedProject));
      }
      qc.setQueryData<ProjectDetails>(projectKeys.detail(updatedProject.id), (old) => (old ? { ...old, ...updatedProject } : updatedProject));
      qc.setQueriesData<ProjectDetails[]>({ queryKey: projectKeys.lists(), exact: false }, (old) => {
        if (!old) return old;
        return old.map((p) => (p.id === updatedProject.id ? { ...p, ...updatedProject } : p));
      });
      qc.invalidateQueries({ queryKey: projectKeys.details() });
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) => {
      const res = await api.delete(`/api/v1/projects/${projectId}`, { showSuccessToast: true, showErrorToast: true });
      return unwrap(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

export const useAddProjectMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, data }: { projectId: string; data: AddProjectMemberDto }) => {
      const res = await api.post<ProjectMember>(`/api/v1/projects/${projectId}/members`, data, { showSuccessToast: true, showErrorToast: true });
      return unwrap<ProjectMember>(res);
    },
    onSuccess: (newMember, variables) => {
      qc.setQueriesData<ProjectDetails>({ queryKey: projectKeys.details(), exact: false }, (old) => {
        if (!old || old.id !== variables.projectId) return old;
        const alreadyAdded = old.members.some((m) => m.userId === newMember?.userId);
        if (alreadyAdded) return old;
        return { ...old, members: [...old.members, newMember], stats: { ...old.stats, totalMembers: old.stats.totalMembers + 1 }, _count: { ...old._count, members: old._count.members + 1 } };
      });
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

export const useUpdateProjectMemberRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, memberId, role }: { projectId: string; memberId: string; role: "MANAGER" | "COLLABORATOR" | "VIEWER" }) => {
      const res = await api.patch<ProjectMember>(`/api/v1/projects/${projectId}/members/${memberId}`, { role }, { showSuccessToast: true, showErrorToast: true });
      return unwrap<ProjectMember>(res);
    },
    onSuccess: (_updatedMember, variables) => {
      qc.setQueriesData<ProjectDetails>({ queryKey: projectKeys.details() }, (old) => {
        if (!old) return old;
        return { ...old, members: old.members.map((m) => (m.userId === variables.memberId ? { ...m, role: variables.role } : m)) };
      });
    },
  });
};

export const useRemoveProjectMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, memberId }: { projectId: string; memberId: string }) => {
      const res = await api.delete(`/api/v1/projects/${projectId}/members/${memberId}`, { showSuccessToast: true, showErrorToast: true });
      return unwrap(res);
    },
    onSuccess: (_, variables) => {
      qc.setQueriesData<ProjectDetails>({ queryKey: projectKeys.details() }, (old) => {
        if (!old) return old;
        return { ...old, members: old.members.filter((m) => m.userId !== variables.memberId), stats: { ...old.stats, totalMembers: Math.max(0, old.stats.totalMembers - 1) }, _count: { ...old._count, members: Math.max(0, old._count.members - 1) } };
      });
    },
  });
};
