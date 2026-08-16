// hooks/useTimeEntries.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import type { TimeEntry, TimeEntryCategory } from "@/types/task.types";

export interface CreateTimeEntryInput {
  taskId: string;
  workspaceId?: string | null;
  duration: number; // minutes
  category?: TimeEntryCategory;
  billable?: boolean;
  description?: string | null;
  startedAt?: string;
  endedAt?: string;
}

export interface UpdateTimeEntryInput {
  id: string;
  taskId: string;
  workspaceId?: string | null;
  duration?: number;
  category?: TimeEntryCategory;
  billable?: boolean;
  description?: string | null;
  startedAt?: string;
  endedAt?: string;
}

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const timeEntryKeys = {
  all: ["time-entries"] as const,
  task: (taskId: string) => [...timeEntryKeys.all, "task", taskId] as const,
  my: (from?: string, to?: string) =>
    [...timeEntryKeys.all, "my", from ?? "all", to ?? "all"] as const,
  workspace: (workspaceId: string, from?: string, to?: string) =>
    [...timeEntryKeys.all, "workspace", workspaceId, from ?? "all", to ?? "all"] as const,
};

// Refreshes the workspace analytics (time summary) when an entry changes.
const invalidateAnalytics = (qc: ReturnType<typeof useQueryClient>, workspaceId?: string | null) => {
  if (workspaceId) {
    qc.invalidateQueries({ queryKey: ['analytics', workspaceId] });
  }
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useTaskTimeEntries(taskId: string) {
  return useQuery({
    queryKey: timeEntryKeys.task(taskId),
    queryFn: async () => {
      const result = await api.get<TimeEntry[]>(
        `/api/v1/time-entries/task/${taskId}`,
        { showErrorToast: false }
      );
      return result?.success ? (result.data ?? []) : [];
    },
    enabled: !!taskId,
    staleTime: 30_000,
  });
}

/**
 * The requesting user's own entries across all tasks.
 * `from`/`to` are ISO datetime strings; when omitted the server returns
 * every entry the user has ever logged.
 */
export function useMyTimeEntries(from?: string, to?: string) {
  return useQuery({
    queryKey: timeEntryKeys.my(from, to),
    queryFn: async () => {
      const result = await api.get<TimeEntry[]>("/api/v1/time-entries/my", {
        params: {
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        },
        showErrorToast: false,
      });
      return result?.success ? (result.data ?? []) : [];
    },
    staleTime: 30_000,
  });
}

/**
 * Every entry on tasks in a workspace that the requesting user can access.
 * `from`/`to` are ISO datetime strings; when omitted the server returns all
 * entries in scope. Includes the author (`user`) alongside the task.
 */
export function useWorkspaceTimeEntries(
  workspaceId?: string,
  from?: string,
  to?: string,
) {
  return useQuery({
    queryKey: timeEntryKeys.workspace(workspaceId ?? "", from, to),
    queryFn: async () => {
      const result = await api.get<TimeEntry[]>(
        `/api/v1/time-entries/workspace/${workspaceId}`,
        {
          params: {
            ...(from ? { from } : {}),
            ...(to ? { to } : {}),
          },
          showErrorToast: false,
        },
      );
      return result?.success ? (result.data ?? []) : [];
    },
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
}

export function useAddTimeEntry() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTimeEntryInput): Promise<TimeEntry> => {
      const result = await api.post<TimeEntry>("/api/v1/time-entries", input);
      if (!result?.success || !result.data) {
        throw new Error("Failed to add time entry");
      }
      return result.data;
    },
    onSuccess: (entry, input) => {
      qc.invalidateQueries({ queryKey: timeEntryKeys.task(entry.taskId) });
      qc.invalidateQueries({ queryKey: timeEntryKeys.all });
      invalidateAnalytics(qc, input.workspaceId);
      toast.success("Time entry added");
    },
    onError: () => {
      toast.error("Failed to add time entry");
    },
  });
}

export function useUpdateTimeEntry() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: UpdateTimeEntryInput): Promise<TimeEntry> => {
      const result = await api.patch<TimeEntry>(
        `/api/v1/time-entries/${id}`,
        input
      );
      if (!result?.success || !result.data) {
        throw new Error("Failed to update time entry");
      }
      return result.data;
    },
    onSuccess: (entry, input) => {
      qc.invalidateQueries({ queryKey: timeEntryKeys.task(entry.taskId) });
      qc.invalidateQueries({ queryKey: timeEntryKeys.all });
      invalidateAnalytics(qc, input.workspaceId);
      toast.success("Time entry updated");
    },
    onError: () => {
      toast.error("Failed to update time entry");
    },
  });
}

export function useDeleteTimeEntry() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: string;
      taskId: string;
      workspaceId?: string | null;
    }): Promise<void> => {
      await api.delete(`/api/v1/time-entries/${input.id}`);
    },
    onSuccess: (_, input) => {
      qc.invalidateQueries({ queryKey: timeEntryKeys.task(input.taskId) });
      qc.invalidateQueries({ queryKey: timeEntryKeys.all });
      invalidateAnalytics(qc, input.workspaceId);
      toast.success("Time entry deleted");
    },
    onError: () => {
      toast.error("Failed to delete time entry");
    },
  });
}
