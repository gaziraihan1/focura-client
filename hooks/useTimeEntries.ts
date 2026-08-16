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
    mutationFn: async ({
      entry,
    }: {
      entry: TimeEntry;
      workspaceId?: string | null;
    }): Promise<string> => {
      const result = await api.delete(`/api/v1/time-entries/${entry.id}`);
      if (!result?.success) {
        throw new Error("Failed to delete time entry");
      }
      return entry.taskId;
    },
    onSuccess: (taskId, input) => {
      qc.invalidateQueries({ queryKey: timeEntryKeys.task(taskId) });
      invalidateAnalytics(qc, input.workspaceId);
      toast.success("Time entry deleted");
    },
    onError: () => {
      toast.error("Failed to delete time entry");
    },
  });
}
