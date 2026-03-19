import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { CreateSubtaskDto, Subtask, SubtaskStats, SubtaskStatus, UpdateSubtaskDto } from "@/types/subtasks.types";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const subtaskKeys = {
  all:   (parentId: string) => ["subtasks", parentId] as const,
  stats: (parentId: string) => ["subtasks", parentId, "stats"] as const,
};



// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useSubtasks(parentTaskId: string) {
  return useQuery({
    queryKey: subtaskKeys.all(parentTaskId),
    queryFn:  async (): Promise<Subtask[]> => {
      const res = await api.get<Subtask[]>(
        `/api/tasks/${parentTaskId}/subtasks`,
      );
      return res?.data ?? [];
    },
    enabled:   !!parentTaskId,
    staleTime: 60 * 1000,
  });
}

export function useSubtaskStats(parentTaskId: string) {
  return useQuery({
    queryKey: subtaskKeys.stats(parentTaskId),
    queryFn:  async (): Promise<SubtaskStats> => {
      const res = await api.get<SubtaskStats>(
        `/api/tasks/${parentTaskId}/subtasks/stats`,
      );
      return res?.data as SubtaskStats;
    },
    enabled:   !!parentTaskId,
    staleTime: 60 * 1000,
  });
}

export function useCreateSubtask(parentTaskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubtaskDto): Promise<Subtask> => {
      const res = await api.post<Subtask>(
        `/api/tasks/${parentTaskId}/subtasks`,
        data,
        { showSuccessToast: false },
      );
      return res?.data as Subtask;
    },
    onSuccess: (newSubtask) => {
      // Optimistic append
      queryClient.setQueryData<Subtask[]>(
        subtaskKeys.all(parentTaskId),
        (old) => {
          if (!old) return [newSubtask];
          if (old.some((s) => s.id === newSubtask.id)) return old;
          return [...old, newSubtask];
        },
      );
      queryClient.invalidateQueries({ queryKey: subtaskKeys.all(parentTaskId) });
      queryClient.invalidateQueries({ queryKey: subtaskKeys.stats(parentTaskId) });
    },
  });
}

export function useUpdateSubtask(parentTaskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subtaskId,
      data,
    }: {
      subtaskId: string;
      data:      UpdateSubtaskDto;
    }): Promise<Subtask> => {
      const res = await api.put<Subtask>(
        `/api/tasks/${parentTaskId}/subtasks/${subtaskId}`,
        data,
        { showSuccessToast: false },
      );
      return res?.data as Subtask;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Subtask[]>(
        subtaskKeys.all(parentTaskId),
        (old) => old?.map((s) => (s.id === updated.id ? updated : s)) ?? [],
      );
      queryClient.invalidateQueries({ queryKey: subtaskKeys.stats(parentTaskId) });
    },
  });
}

export function useUpdateSubtaskStatus(parentTaskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subtaskId,
      status,
    }: {
      subtaskId: string;
      status:    SubtaskStatus;
    }): Promise<Subtask> => {
      const res = await api.patch<Subtask>(
        `/api/tasks/${parentTaskId}/subtasks/${subtaskId}/status`,
        { status },
        { showSuccessToast: false },
      );
      return res?.data as Subtask;
    },
    onMutate: async ({ subtaskId, status }) => {
      await queryClient.cancelQueries({ queryKey: subtaskKeys.all(parentTaskId) });
      const previous = queryClient.getQueryData<Subtask[]>(subtaskKeys.all(parentTaskId));
      queryClient.setQueryData<Subtask[]>(
        subtaskKeys.all(parentTaskId),
        (old) => old?.map((s) => (s.id === subtaskId ? { ...s, status } : s)) ?? [],
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(subtaskKeys.all(parentTaskId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: subtaskKeys.all(parentTaskId) });
      queryClient.invalidateQueries({ queryKey: subtaskKeys.stats(parentTaskId) });
    },
  });
}

export function useDeleteSubtask(parentTaskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subtaskId: string): Promise<void> => {
      await api.delete(
        `/api/tasks/${parentTaskId}/subtasks/${subtaskId}`,
        { showSuccessToast: false },
      );
    },
    onMutate: async (subtaskId) => {
      await queryClient.cancelQueries({ queryKey: subtaskKeys.all(parentTaskId) });
      const previous = queryClient.getQueryData<Subtask[]>(subtaskKeys.all(parentTaskId));
      queryClient.setQueryData<Subtask[]>(
        subtaskKeys.all(parentTaskId),
        (old) => old?.filter((s) => s.id !== subtaskId) ?? [],
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(subtaskKeys.all(parentTaskId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: subtaskKeys.all(parentTaskId) });
      queryClient.invalidateQueries({ queryKey: subtaskKeys.stats(parentTaskId) });
    },
  });
}