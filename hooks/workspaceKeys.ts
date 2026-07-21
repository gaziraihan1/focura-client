export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "list"] as const,
  details: () => [...workspaceKeys.all, "detail"] as const,
  detail: (slug: string) => [...workspaceKeys.details(), slug] as const,
  overview: (slug: string) => [...workspaceKeys.detail(slug), "overview"] as const,
  members: (id: string) => [...workspaceKeys.all, id, "members"] as const,
  stats: (id: string) => [...workspaceKeys.all, id, "stats"] as const,
  storage: (id: string) => [...workspaceKeys.all, id, "storage"] as const,
};
