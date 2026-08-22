import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Task } from "../useTask";
import { taskKeys } from "../taskKeys";
import { ProjectDetails, projectKeys } from "../useProjects";
import { getRetryDelay } from "./utils";

export function useBatchUpdateTaskStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskIds, status }: { taskIds: string[]; status: Task["status"] }) => {
      const results = await Promise.allSettled(
        taskIds.map((id) =>
          api.patch<Task>(`/api/v1/tasks/${id}/status`, { status }, { showSuccessToast: false })
        )
      );
      return results;
    },
    onMutate: async ({ taskIds, status }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: taskKeys.lists() }),
        qc.cancelQueries({ queryKey: projectKeys.all }),
      ]);

      const taskIdSet = new Set(taskIds);
      const listSnapshots: Array<{ queryKey: readonly unknown[]; data: unknown }> = [];
      const projectSnapshots: Array<{ queryKey: readonly unknown[]; data: ProjectDetails }> = [];

      qc.getQueriesData({ queryKey: taskKeys.lists() }).forEach(([queryKey, listData]) => {
        listSnapshots.push({ queryKey, data: listData });
        if (listData && typeof listData === "object" && "data" in listData) {
          const tasks = (listData as { data: Task[] }).data;
          const updatedTasks = tasks.map((t) =>
            taskIdSet.has(t.id) ? { ...t, status } : t
          );
          qc.setQueryData(queryKey, { ...listData, data: updatedTasks });
        }
      });

      qc.getQueriesData<ProjectDetails>({ queryKey: projectKeys.all }).forEach(([queryKey, projectData]) => {
        if (!projectData?.tasks) return;
        projectSnapshots.push({ queryKey, data: projectData });
        qc.setQueryData<ProjectDetails>(queryKey, {
          ...projectData,
          tasks: projectData.tasks.map((t) =>
            taskIdSet.has(t.id) ? { ...t, status } : t
          ),
        });
      });

      return { listSnapshots, projectSnapshots };
    },
    onError: (_err, _variables, context) => {
      context?.listSnapshots.forEach(({ queryKey, data }) => qc.setQueryData(queryKey, data));
      context?.projectSnapshots.forEach(({ queryKey, data }) => qc.setQueryData(queryKey, data));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
      qc.invalidateQueries({ queryKey: taskKeys.stats() });
      qc.invalidateQueries({ queryKey: projectKeys.all });
    },
    retry: 1,
    retryDelay: (attempt) => getRetryDelay(attempt),
  });
}

export function useBatchDeleteTasks() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (taskIds: string[]) => {
      const results = await Promise.allSettled(
        taskIds.map((id) =>
          api.delete(`/api/v1/tasks/${id}`, { showSuccessToast: false })
        )
      );
      return results;
    },
    onMutate: async (taskIds) => {
      await qc.cancelQueries({ queryKey: taskKeys.lists() });

      const taskIdSet = new Set(taskIds);
      const listSnapshots: Array<{ queryKey: readonly unknown[]; data: unknown }> = [];
      qc.getQueriesData({ queryKey: taskKeys.lists() }).forEach(([queryKey, data]) => {
        listSnapshots.push({ queryKey, data });
        if (typeof data === "object" && data !== null && "data" in data) {
          const tasks = (data as { data: Task[] }).data;
          qc.setQueryData(queryKey, {
            ...data,
            data: tasks.filter((t) => !taskIdSet.has(t.id)),
          });
        }
      });

      return { listSnapshots, taskIds };
    },
    onError: (_err, _taskIds, context) => {
      context?.listSnapshots.forEach(({ queryKey, data }) => qc.setQueryData(queryKey, data));
    },
    onSettled: (_data, _err, taskIds) => {
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
      qc.invalidateQueries({ queryKey: taskKeys.stats() });
      taskIds?.forEach((id) => qc.removeQueries({ queryKey: taskKeys.detail(id) }));
    },
    retry: 1,
    retryDelay: (attempt) => getRetryDelay(attempt),
  });
}
