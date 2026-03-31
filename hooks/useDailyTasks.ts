import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "./useTask";
import { api } from "@/lib/axios";

interface DailyTasksData {
  primaryTask: Task | null;
  secondaryTasks: Task[];
}

interface AddDailyTaskPayload {
  taskId: string;
  type: "PRIMARY" | "SECONDARY";
}

const dailyTasksKeys = {
  all: ["daily-tasks"] as const,
  byWorkspace: (workspaceSlug?: string) =>
    [...dailyTasksKeys.all, workspaceSlug] as const,
};

export function useDailyTasks(workspaceSlug?: string) {
  const qc = useQueryClient();
  const queryKey = dailyTasksKeys.byWorkspace(workspaceSlug);

  const {
    data: dailyTasks,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await api.get<DailyTasksData>("/api/daily-tasks");
      return response?.data || { primaryTask: null, secondaryTasks: [] };
    },
    staleTime: 1000 * 60 * 5,
  });

  const addDailyTaskMutation = useMutation({
    mutationFn: async (payload: AddDailyTaskPayload) => {
      return await api.post("/api/daily-tasks", payload, {
        showSuccessToast: true,
        showErrorToast: true,
      });
    },
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey });

      const previous = qc.getQueryData<DailyTasksData>(queryKey);

      const task = findTaskInCache(qc, payload.taskId);

      if (task) {
        qc.setQueryData<DailyTasksData>(queryKey, (old) => {
          const current = old || { primaryTask: null, secondaryTasks: [] };

          if (payload.type === "PRIMARY") {
            return { ...current, primaryTask: task };
          } else {
            const already = current.secondaryTasks.some(
              (t) => t.id === task.id,
            );
            if (already) return current;
            return {
              ...current,
              secondaryTasks: [...current.secondaryTasks, task],
            };
          }
        });
      }

      return { previous };
    },
    onError: (_err, _payload, context) => {
      if (context?.previous) {
        qc.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    },
  });

  const removeDailyTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return await api.delete(`/api/daily-tasks/${taskId}`, {
        showSuccessToast: true,
        showErrorToast: true,
      });
    },
    onMutate: async (taskId) => {
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<DailyTasksData>(queryKey);

      qc.setQueryData<DailyTasksData>(queryKey, (old) => {
        if (!old) return old;
        return {
          primaryTask: old.primaryTask?.id === taskId ? null : old.primaryTask,
          secondaryTasks: old.secondaryTasks.filter((t) => t.id !== taskId),
        };
      });

      return { previous };
    },
    onError: (_err, _taskId, context) => {
      if (context?.previous) {
        qc.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    },
  });

  const addToPrimary = async (taskId: string) => {
    try {
      await addDailyTaskMutation.mutateAsync({ taskId, type: "PRIMARY" });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      };
    }
  };

  const addToSecondary = async (taskId: string) => {
    try {
      await addDailyTaskMutation.mutateAsync({ taskId, type: "SECONDARY" });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      };
    }
  };

  const removeDailyTask = async (taskId: string) => {
    try {
      await removeDailyTaskMutation.mutateAsync(taskId);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      };
    }
  };

  return {
    primaryTask: dailyTasks?.primaryTask || null,
    secondaryTasks: dailyTasks?.secondaryTasks || [],
    hasPrimaryTask: !!dailyTasks?.primaryTask,
    isLoading,
    error: error?.message || null,
    addToPrimary,
    addToSecondary,
    removeDailyTask,
    refresh: refetch,
    isAdding: addDailyTaskMutation.isPending,
    isRemoving: removeDailyTaskMutation.isPending,
  };
}

function findTaskInCache(
  qc: ReturnType<typeof useQueryClient>,
  taskId: string,
): Task | undefined {
  const allCaches = qc.getQueriesData<{ tasks: Task[] }>({
    queryKey: ["tasks"],
  });

  for (const [, data] of allCaches) {
    if (!data?.tasks) continue;
    const found = data.tasks.find((t) => t.id === taskId);
    if (found) return found;
  }
}
