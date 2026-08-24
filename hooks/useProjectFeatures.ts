import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/axios";
import { milestoneKeys, sprintKeys, sectionKeys, viewKeys, favoriteKeys } from "./projectFeatureKeys";
import type { Task } from "./useTask";

export type TaskStatus = Task["status"];

// ── Milestone Types ──────────────────────────────────────────────────────────

export interface MilestoneItem {
  id: string;
  title: string;
  description?: string;
  status: "ON_TRACK" | "AT_RISK" | "DELAYED" | "COMPLETED";
  progress: number;
  color?: string;
  icon?: string;
  dueDate?: string;
  completedAt?: string;
  completed: boolean;
  projectId: string;
  dependsOnId?: string;
  tasks?: Array<{ id: string; title: string; status: string }>;
  tasksDone?: number;
  taskProgress?: number | null;
  dependsOn?: MilestoneItem;
  dependencies?: MilestoneItem[];
}

export interface MilestoneStats {
  total: number;
  completed: number;
  atRisk: number;
  delayed: number;
  onTrack: number;
  avgProgress: number;
  milestones: MilestoneItem[];
}

// ── Milestone Hooks ──────────────────────────────────────────────────────────

export const useProjectMilestones = (projectId?: string) =>
  useQuery({
    queryKey: milestoneKeys.stats(projectId || ""),
    queryFn: async () => {
      const res = await api.get(`/api/v1/projects/${projectId}/milestones`, { showErrorToast: false });
      return unwrap<MilestoneStats>(res);
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });

export const useCreateMilestone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; description?: string; dueDate?: string; color?: string; projectId: string; dependsOnId?: string }) => {
      const res = await api.post(`/api/v1/projects/${data.projectId}/milestones`, data, { showSuccessToast: true, showErrorToast: true });
      return unwrap<MilestoneItem>(res);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: milestoneKeys.stats(vars.projectId) }),
  });
};

export const useUpdateMilestone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ milestoneId, projectId, ...data }: { milestoneId: string; projectId: string } & Partial<MilestoneItem>) => {
      const res = await api.patch(`/api/v1/projects/${projectId}/milestones/${milestoneId}`, data, { showSuccessToast: true, showErrorToast: true });
      return unwrap<MilestoneItem>(res);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: milestoneKeys.stats(vars.projectId) }),
  });
};

export const useDeleteMilestone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ milestoneId, projectId }: { milestoneId: string; projectId: string }) => {
      await api.delete(`/api/v1/projects/${projectId}/milestones/${milestoneId}`, { showSuccessToast: true, showErrorToast: true });
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: milestoneKeys.stats(vars.projectId) }),
  });
};

export const useUpdateMilestoneProgress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ milestoneId, projectId, progress }: { milestoneId: string; projectId: string; progress: number }) => {
      const res = await api.put(`/api/v1/projects/${projectId}/milestones/${milestoneId}/progress`, { progress }, { showSuccessToast: true, showErrorToast: true });
      return unwrap<MilestoneItem>(res);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: milestoneKeys.stats(vars.projectId) }),
  });
};

// ── Sprint Types ─────────────────────────────────────────────────────────────

export interface SprintItem {
  id: string;
  name: string;
  goal?: string;
  status: "PLANNING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  startDate: string;
  endDate: string;
  completedAt?: string;
  retrospective?: string;
  totalPoints?: number;
  completedPoints?: number;
  velocity?: number;
  projectId: string;
  _count?: { tasks: number };
}

export interface SprintStats {
  sprints: SprintItem[];
  activeSprint: SprintItem | null;
  avgVelocity: number;
}

// ── Sprint Hooks ─────────────────────────────────────────────────────────────

export const useProjectSprints = (projectId?: string) =>
  useQuery({
    queryKey: sprintKeys.stats(projectId || ""),
    queryFn: async () => {
      const res = await api.get(`/api/v1/projects/${projectId}/sprints`, { showErrorToast: false });
      return unwrap<SprintStats>(res);
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });

export const useCreateSprint = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; goal?: string; startDate: string; endDate: string; projectId: string }) => {
      const res = await api.post(`/api/v1/projects/${data.projectId}/sprints`, data, { showSuccessToast: true, showErrorToast: true });
      return unwrap<SprintItem>(res);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: sprintKeys.stats(vars.projectId) }),
  });
};

export const useUpdateSprint = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sprintId, projectId, ...data }: { sprintId: string; projectId: string } & Partial<SprintItem>) => {
      const res = await api.patch(`/api/v1/projects/${projectId}/sprints/${sprintId}`, data, { showSuccessToast: true, showErrorToast: true });
      return unwrap<SprintItem>(res);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: sprintKeys.stats(vars.projectId) }),
  });
};

export const useDeleteSprint = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sprintId, projectId }: { sprintId: string; projectId: string }) => {
      await api.delete(`/api/v1/projects/${projectId}/sprints/${sprintId}`, { showSuccessToast: true, showErrorToast: true });
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: sprintKeys.stats(vars.projectId) }),
  });
};

export const useCompleteSprint = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sprintId, projectId, retrospective }: { sprintId: string; projectId: string; retrospective?: string }) => {
      const res = await api.post(`/api/v1/projects/${projectId}/sprints/${sprintId}/complete`, { retrospective }, { showSuccessToast: true, showErrorToast: true });
      return unwrap<SprintItem>(res);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: sprintKeys.stats(vars.projectId) }),
  });
};

// ── Section Types & Hooks ────────────────────────────────────────────────────

export interface ProjectSectionItem {
  id: string;
  name: string;
  description?: string;
  color?: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED";
  position: number;
  projectId: string;
  wipLimit?: number | null;
  taskStatus?: TaskStatus | null;
  _count?: { tasks: number };
}

export const useProjectSections = (projectId?: string) =>
  useQuery({
    queryKey: sectionKeys.list(projectId || ""),
    queryFn: async () => {
      const res = await api.get(`/api/v1/projects/${projectId}/sections`, { showErrorToast: false });
      return unwrap<ProjectSectionItem[]>(res);
    },
    enabled: !!projectId,
    // Short stale time so per-section task counts stay fresh right after a
    // task is created/assigned (task mutations don't invalidate sections).
    staleTime: 30 * 1000,
  });

export const useCreateSection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string; color?: string; wipLimit?: number; taskStatus?: TaskStatus; projectId: string }) => {
      const res = await api.post(`/api/v1/projects/${data.projectId}/sections`, data, { showSuccessToast: true, showErrorToast: true });
      return unwrap<ProjectSectionItem>(res);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: sectionKeys.list(vars.projectId) }),
  });
};

export const useUpdateSection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sectionId, projectId, ...data }: { sectionId: string; projectId: string } & Partial<ProjectSectionItem>) => {
      const res = await api.patch(`/api/v1/projects/${projectId}/sections/${sectionId}`, data, { showSuccessToast: true, showErrorToast: true });
      return unwrap<ProjectSectionItem>(res);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: sectionKeys.list(vars.projectId) }),
  });
};

export const useDeleteSection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sectionId, projectId }: { sectionId: string; projectId: string }) => {
      await api.delete(`/api/v1/projects/${projectId}/sections/${sectionId}`, { showSuccessToast: true, showErrorToast: true });
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: sectionKeys.list(vars.projectId) }),
  });
};

export const useReorderSections = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, sectionIds }: { projectId: string; sectionIds: string[] }) => {
      const res = await api.put(`/api/v1/projects/${projectId}/sections/reorder`, { sectionIds }, { showSuccessToast: true, showErrorToast: true });
      return unwrap(res);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: sectionKeys.list(vars.projectId) }),
  });
};

// ── View Types & Hooks ───────────────────────────────────────────────────────

export interface ProjectViewItem {
  id: string;
  name: string;
  description?: string;
  type: "KANBAN" | "LIST" | "CALENDAR" | "TIMELINE";
  filters?: Record<string, unknown>;
  sort?: Record<string, unknown>;
  config?: Record<string, unknown>;
  isDefault: boolean;
  visibility: "PRIVATE" | "SHARED";
  createdById: string;
  projectId: string;
}

export const useProjectViews = (projectId?: string) =>
  useQuery({
    queryKey: viewKeys.list(projectId || ""),
    queryFn: async () => {
      const res = await api.get(`/api/v1/projects/${projectId}/views`, { showErrorToast: false });
      return unwrap<ProjectViewItem[]>(res);
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateView = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string; type?: string; projectId: string; isDefault?: boolean; visibility?: string; filters?: Record<string, unknown>; sort?: Record<string, unknown>; config?: Record<string, unknown> }) => {
      const res = await api.post(`/api/v1/projects/${data.projectId}/views`, data, { showSuccessToast: true, showErrorToast: true });
      return unwrap<ProjectViewItem>(res);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: viewKeys.list(vars.projectId) }),
  });
};

export const useUpdateView = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ viewId, projectId, ...data }: { viewId: string; projectId: string } & Partial<Omit<ProjectViewItem, "id" | "createdById">>) => {
      const res = await api.patch(`/api/v1/projects/${projectId}/views/${viewId}`, data, { showSuccessToast: true, showErrorToast: true });
      return unwrap<ProjectViewItem>(res);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: viewKeys.list(vars.projectId) }),
  });
};

export const useDeleteView = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ viewId, projectId }: { viewId: string; projectId: string }) => {
      await api.delete(`/api/v1/projects/${projectId}/views/${viewId}`, { showSuccessToast: true, showErrorToast: true });
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: viewKeys.list(vars.projectId) }),
  });
};

// ── Favorite Types & Hooks ───────────────────────────────────────────────────

export interface FavoriteItem {
  id: string;
  projectId: string;
  group?: string;
  sortOrder: number;
  note?: string;
  createdAt: string;
  project: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
    status: string;
    workspace?: { slug: string };
  };
}

export interface FavoriteData {
  grouped: Array<{ group: string; favorites: FavoriteItem[] }>;
  ungrouped: FavoriteItem[];
}

export const useMyFavorites = () =>
  useQuery({
    queryKey: favoriteKeys.mine(),
    queryFn: async () => {
      const res = await api.get("/api/v1/projects/favorites/mine");
      return unwrap<FavoriteData>(res);
    },
    staleTime: 2 * 60 * 1000,
  });

export const useCheckFavorite = (projectId?: string) =>
  useQuery({
    queryKey: favoriteKeys.check(projectId || ""),
    queryFn: async () => {
      const res = await api.get(`/api/v1/projects/${projectId}/favorite`, { showErrorToast: false });
      return unwrap<{ favorited: boolean }>(res);
    },
    enabled: !!projectId,
    staleTime: 60 * 1000,
  });

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) => {
      const res = await api.post(`/api/v1/projects/${projectId}/favorite/toggle`, {}, { showSuccessToast: true, showErrorToast: true });
      return unwrap<{ favorited: boolean }>(res);
    },
    onSuccess: (_, projectId) => {
      qc.invalidateQueries({ queryKey: favoriteKeys.mine() });
      qc.invalidateQueries({ queryKey: favoriteKeys.check(projectId) });
    },
  });
};

export const useUpdateFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, ...data }: { projectId: string; group?: string | null; note?: string | null }) => {
      const res = await api.put(`/api/v1/projects/${projectId}/favorite`, data, { showSuccessToast: true, showErrorToast: true });
      return unwrap(res);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: favoriteKeys.mine() }),
  });
};
