export const adminKeys = {
  stats: ["admin", "stats"] as const,
  workspaces: (p: object) => ["admin", "workspaces", p] as const,
  workspaceDetail: (slug: string) => ["admin", "workspace", slug] as const,
  users: (p: object) => ["admin", "users", p] as const,
  userDetail: (id: string) => ["admin", "user", id] as const,
  projects: (p: object) => ["admin", "projects", p] as const,
  billing: (p: object) => ["admin", "billing", p] as const,
  activity: (p: object) => ["admin", "activity", p] as const,
};
