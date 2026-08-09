/**
 * hooks/automationKeys.ts
 */
export const automationKeys = {
  all: ["automations"] as const,
  lists: () => [...automationKeys.all, "list"] as const,
  list: (workspaceId: string, projectId?: string) =>
    [...automationKeys.lists(), workspaceId, projectId ?? "all"] as const,
  details: () => [...automationKeys.all, "detail"] as const,
  detail: (id: string) => [...automationKeys.details(), id] as const,
  runs: (ruleId: string) => [...automationKeys.all, "runs", ruleId] as const,
};
