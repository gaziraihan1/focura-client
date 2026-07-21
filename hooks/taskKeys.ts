import { TaskFilters, TaskSort } from "./useTask";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (
    filters?: TaskFilters,
    page?: number,
    pageSize?: number,
    sort?: TaskSort,
  ) => [...taskKeys.lists(), filters, page, pageSize, sort] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  stats: () => [...taskKeys.all, "stats"] as const,
  stat: (workspaceId?: string, type?: string) =>
    [...taskKeys.stats(), workspaceId || "personal", type || "all"] as const,
  quotas: () => [...taskKeys.all, "quota"] as const,
  personalQuota: () => [...taskKeys.quotas(), "personal"] as const,
  workspaceQuota: (workspaceId: string) =>
    [...taskKeys.quotas(), "workspace", workspaceId] as const,
};

export const commentKeys = {
  all: ["comments"] as const,
  byTask: (taskId: string) => [...commentKeys.all, taskId] as const,
};

export const attachmentKeys = {
  all: ["attachments"] as const,
  byTask: (taskId: string) => [...attachmentKeys.all, taskId] as const,
};

export const taskOverviewKeys = {
  detail: (id: string) => [...taskKeys.details(), id, "overview"] as const,
};
