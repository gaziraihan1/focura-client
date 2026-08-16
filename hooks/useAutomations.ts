/**
 * hooks/useAutomations.ts
 *
 * React Query hooks for automation rules.
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { automationKeys } from "./automationKeys";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AutomationTrigger = "STATUS_CHANGED" | "TASK_CREATED";

export type AutomationActionType = "ASSIGN_USER" | "SET_PRIORITY" | "NOTIFY_MEMBERS";

export interface AutomationTriggerConfig {
  fromStatus?: string | null;
  toStatus?: string | null;
  projectId?: string | null;
}

export interface AutomationActionConfig {
  assigneeUserId?: string | null;
  email?: string | null;
  role?: "project-owner" | "actor" | null;
  priority?: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  message?: string | null;
}

export interface AutomationAction {
  type: AutomationActionType;
  config: AutomationActionConfig;
}

export interface AutomationRule {
  id: string;
  workspaceId: string;
  projectId: string | null;
  name: string;
  triggerType: AutomationTrigger;
  triggerConfig: AutomationTriggerConfig;
  actions: AutomationAction[];
  enabled: boolean;
  runCount: number;
  lastRunAt: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRun {
  id: string;
  action: string;
  taskId: string | null;
  metadata: unknown;
  createdAt: string;
  user: { id: string; name: string; image?: string | null } | null;
}

export interface CreateAutomationInput {
  workspaceId: string;
  projectId?: string | null;
  name: string;
  triggerType: AutomationTrigger;
  triggerConfig?: AutomationTriggerConfig;
  actions: AutomationAction[];
}

export type UpdateAutomationInput = Partial<
  Omit<CreateAutomationInput, "workspaceId">
> & { enabled?: boolean };

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * List automation rules for a workspace. Optionally scoped to a project
 * (includes the workspace-wide rules too).
 */
export function useAutomations(workspaceId?: string, projectId?: string) {
  return useQuery({
    queryKey: automationKeys.list(workspaceId ?? "", projectId),
    queryFn: async () => {
      const response = await api.get<AutomationRule[]>("/api/v1/automations", {
        params: projectId ? { workspaceId, projectId } : { workspaceId },
        showErrorToast: true,
      });
      return response.data ?? [];
    },
    enabled: Boolean(workspaceId),
    staleTime: 30 * 1000,
  });
}

/**
 * Recent execution history for a rule.
 */
export function useAutomationRuns(ruleId?: string) {
  return useQuery({
    queryKey: automationKeys.runs(ruleId ?? ""),
    queryFn: async () => {
      const response = await api.get<AutomationRun[]>(
        `/api/v1/automations/${ruleId}/runs`,
        { showErrorToast: false },
      );
      return response.data ?? [];
    },
    enabled: Boolean(ruleId),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

function useInvalidateAutomations() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: automationKeys.all });
}

export function useCreateAutomation() {
  const invalidate = useInvalidateAutomations();

  return useMutation({
    mutationFn: async (data: CreateAutomationInput) => {
      const result = await api.post<AutomationRule>("/api/v1/automations", data, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return result.data;
    },
    onSuccess: invalidate,
  });
}

export function useUpdateAutomation() {
  const invalidate = useInvalidateAutomations();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateAutomationInput & { id: string }) => {
      const result = await api.patch<AutomationRule>(`/api/v1/automations/${id}`, data, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return result.data;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteAutomation() {
  const invalidate = useInvalidateAutomations();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/automations/${id}`, {
        showSuccessToast: true,
        showErrorToast: true,
      });
    },
    onSuccess: invalidate,
  });
}

/**
 * Run a rule on demand against a chosen task (POST /:id/test).
 */
export function useTestAutomation() {
  const invalidate = useInvalidateAutomations();

  return useMutation({
    mutationFn: async ({ id, taskId }: { id: string; taskId: string }) => {
      await api.post(`/api/v1/automations/${id}/test`, { taskId }, {
        showSuccessToast: true,
        showErrorToast: true,
      });
    },
    onSuccess: invalidate,
  });
}
