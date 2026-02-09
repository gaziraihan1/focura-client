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

// Query key factory
const dailyTasksKeys = {
  all: ["daily-tasks"] as const,
  byWorkspace: (workspaceSlug?: string) => 
    [...dailyTasksKeys.all, workspaceSlug] as const,
};

export function useDailyTasks(workspaceSlug?: string) {
  const queryClient = useQueryClient();

  // Fetch daily tasks
  const {
    data: dailyTasks,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: dailyTasksKeys.byWorkspace(workspaceSlug),
    queryFn: async () => {
      const response = await api.get<DailyTasksData>("/api/daily-tasks");
      return response?.data || { primaryTask: null, secondaryTasks: [] };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add task to daily tasks (primary or secondary)
  const addDailyTaskMutation = useMutation({
    mutationFn: async (payload: AddDailyTaskPayload) => {
      return await api.post("/api/daily-tasks", payload, {
        showSuccessToast: true,
        showErrorToast: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dailyTasksKeys.byWorkspace(workspaceSlug),
      });
    },
  });

  // Remove daily task
  const removeDailyTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return await api.delete(`/api/daily-tasks/${taskId}`, {
        showSuccessToast: true,
        showErrorToast: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dailyTasksKeys.byWorkspace(workspaceSlug),
      });
    },
  });

  // Helper functions
  const addToPrimary = async (taskId: string) => {
    try {
      await addDailyTaskMutation.mutateAsync({
        taskId,
        type: "PRIMARY",
      });
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
      await addDailyTaskMutation.mutateAsync({
        taskId,
        type: "SECONDARY",
      });
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
    hasPrimaryTask: dailyTasks?.primaryTask !== null,
    isLoading,
    error: error?.message || null,
    addToPrimary,
    addToSecondary,
    removeDailyTask,
    refresh: refetch,
    // Expose mutation states for more granular control if needed
    isAdding: addDailyTaskMutation.isPending,
    isRemoving: removeDailyTaskMutation.isPending,
  };
}