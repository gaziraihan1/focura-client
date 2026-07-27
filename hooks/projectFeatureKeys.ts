export const milestoneKeys = {
  all: ["milestones"] as const,
  lists: () => [...milestoneKeys.all, "list"] as const,
  list: (projectId: string) => [...milestoneKeys.lists(), projectId] as const,
  details: () => [...milestoneKeys.all, "detail"] as const,
  detail: (id: string) => [...milestoneKeys.details(), id] as const,
  stats: (projectId: string) => [...milestoneKeys.all, "stats", projectId] as const,
};

export const sprintKeys = {
  all: ["sprints"] as const,
  lists: () => [...sprintKeys.all, "list"] as const,
  list: (projectId: string) => [...sprintKeys.lists(), projectId] as const,
  details: () => [...sprintKeys.all, "detail"] as const,
  detail: (id: string) => [...sprintKeys.details(), id] as const,
  active: (projectId: string) => [...sprintKeys.all, "active", projectId] as const,
  stats: (projectId: string) => [...sprintKeys.all, "stats", projectId] as const,
};

export const sectionKeys = {
  all: ["sections"] as const,
  lists: () => [...sectionKeys.all, "list"] as const,
  list: (projectId: string) => [...sectionKeys.lists(), projectId] as const,
};

export const viewKeys = {
  all: ["project-views"] as const,
  lists: () => [...viewKeys.all, "list"] as const,
  list: (projectId: string) => [...viewKeys.lists(), projectId] as const,
};

export const favoriteKeys = {
  all: ["favorites"] as const,
  mine: () => [...favoriteKeys.all, "mine"] as const,
  check: (projectId: string) => [...favoriteKeys.all, "check", projectId] as const,
};
