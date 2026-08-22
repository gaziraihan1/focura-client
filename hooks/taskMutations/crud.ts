import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Task, CreateTaskDto, RecurrenceInputDto } from "../useTask";
import { taskKeys } from "../taskKeys";
import { ProjectDetails, projectKeys } from "../useProjects";
import { activityKeys } from "../useActivity";
import { propagateTaskResponse, getRetryDelay, MAX_RETRY_ATTEMPTS } from "./utils";

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: CreateTaskDto) => {
      const response = await api.post<Task>("/api/v1/tasks", newTask, { showSuccessToast: true });
      return response?.data;
    },
    onMutate: async (newTask) => {
      if (!newTask.projectId) return;
      await qc.cancelQueries({ queryKey: projectKeys.detail(newTask.projectId) });
      const previous = qc.getQueryData(projectKeys.detail(newTask.projectId));

      const optimisticId = `optimistic-${Date.now()}`;
      qc.setQueryData(projectKeys.detail(newTask.projectId), (old: ProjectDetails | undefined) => {
        if (!old) return old;
        const optimisticTask = {
          id: optimisticId,
          title: newTask.title,
          description: newTask.description ?? null,
          status: newTask.status ?? "TODO",
          priority: newTask.priority ?? "MEDIUM",
          startDate: newTask.startDate ?? null,
          dueDate: newTask.dueDate ?? null,
          createdAt: new Date().toISOString(),
          assignees: [],
          _count: { comments: 0, subtasks: 0, files: 0 },
        };
        return { ...old, tasks: [...(old.tasks ?? []), optimisticTask], _count: { ...old._count, tasks: (old._count?.tasks ?? 0) + 1 } };
      });

      return { previous, optimisticId };
    },
    onSuccess: (data, variables, context) => {
      if (!data) return;
      qc.setQueryData(taskKeys.detail(data.id), data);
      if (variables.projectId) {
        const serverTask = data as unknown as ProjectDetails["tasks"][number];
        qc.setQueryData<ProjectDetails>(projectKeys.detail(variables.projectId), (old) => {
          if (!old) return old;
          const current = old.tasks ?? [];
          const hasGhost = current.some((t) => t.id === context?.optimisticId);
          const tasks = hasGhost
            ? current.map((t) => (t.id === context?.optimisticId ? serverTask : t))
            : [...current, serverTask];
          return { ...old, tasks };
        });
      }
    },
    onError: (_err, variables, context) => {
      if (context?.previous && variables.projectId) {
        qc.setQueryData(projectKeys.detail(variables.projectId), context.previous);
      }
    },
    onSettled: (_data, _err, variables) => {
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
      qc.invalidateQueries({ queryKey: taskKeys.stats() });
      if (variables.projectId) {
        qc.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
        qc.invalidateQueries({ queryKey: [...projectKeys.details(), "slug"] });
      }
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<Partial<Task>, "recurrence"> & { recurrence?: RecurrenceInputDto | null } }) => {
      const response = await api.put<Task>(`/api/v1/tasks/${id}`, data, { showSuccessToast: true });
      return response?.data;
    },
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: taskKeys.detail(id) });
      await qc.cancelQueries({ queryKey: taskKeys.lists() });

      const previousTask = qc.getQueryData<Task>(taskKeys.detail(id));

      const { recurrence: _recurrence, ...rest } = data;
      void _recurrence;

      if (previousTask) {
        qc.setQueryData<Task>(taskKeys.detail(id), { ...previousTask, ...rest });
      }

      qc.getQueriesData({ queryKey: taskKeys.lists() }).forEach(([queryKey, listData]) => {
        if (!listData || typeof listData !== "object" || !("data" in listData)) return;
        const tasks = (listData as { data: Task[] }).data;
        const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, ...rest } : t));
        qc.setQueryData(queryKey, { ...listData, data: updatedTasks });
      });

      return { previousTask };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousTask) {
        qc.setQueryData(taskKeys.detail(id), context.previousTask);
      }
    },
    onSuccess: (data) => {
      if (data) propagateTaskResponse(qc, data);
    },
    onSettled: (_data, _err, { id }) => {
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
      qc.invalidateQueries({ queryKey: taskKeys.stats() });
      qc.invalidateQueries({ queryKey: taskKeys.detail(id) });
      setTimeout(() => { qc.invalidateQueries({ queryKey: activityKeys.task(id) }); }, 800);
    },
    retry: MAX_RETRY_ATTEMPTS,
    retryDelay: (attempt) => getRetryDelay(attempt),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await api.delete(`/api/v1/tasks/${taskId}`, { showSuccessToast: true });
      return response?.data;
    },
    onMutate: async (taskId) => {
      await qc.cancelQueries({ queryKey: taskKeys.lists() });

      const listSnapshots: Array<{ queryKey: readonly unknown[]; data: unknown }> = [];
      qc.getQueriesData({ queryKey: taskKeys.lists() }).forEach(([queryKey, data]) => {
        listSnapshots.push({ queryKey, data });
        if (data && typeof data === "object" && "data" in data) {
          const tasks = (data as { data: Task[] }).data;
          qc.setQueryData(queryKey, { ...data, data: tasks.filter((t) => t.id !== taskId) });
        }
      });

      return { listSnapshots };
    },
    onError: (_err, _taskId, context) => {
      context?.listSnapshots.forEach(({ queryKey, data }) => {
        qc.setQueryData(queryKey, data);
      });
    },
    onSuccess: (_, taskId) => {
      qc.removeQueries({ queryKey: taskKeys.detail(taskId) });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
      qc.invalidateQueries({ queryKey: taskKeys.stats() });
    },
    retry: MAX_RETRY_ATTEMPTS,
    retryDelay: (attempt) => getRetryDelay(attempt),
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Task["status"] }) => {
      const response = await api.patch<Task>(`/api/v1/tasks/${id}/status`, { status }, { showSuccessToast: false });
      return response?.data;
    },
    onMutate: async ({ id, status }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: taskKeys.detail(id) }),
        qc.cancelQueries({ queryKey: taskKeys.lists() }),
        qc.cancelQueries({ queryKey: projectKeys.all }),
      ]);

      const previousTask = qc.getQueryData<Task>(taskKeys.detail(id));
      const projectCacheSnapshots: Array<{ queryKey: readonly unknown[]; data: ProjectDetails }> = [];

      qc.getQueriesData<ProjectDetails>({ queryKey: projectKeys.all }).forEach(([queryKey, projectData]) => {
        if (!projectData?.tasks) return;
        const taskExists = projectData.tasks.some((t) => t.id === id);
        if (!taskExists) return;
        projectCacheSnapshots.push({ queryKey, data: projectData });
        qc.setQueryData<ProjectDetails>(queryKey, { ...projectData, tasks: projectData.tasks.map((t) => t.id === id ? { ...t, status } : t) });
      });

      if (previousTask) {
        qc.setQueryData<Task>(taskKeys.detail(id), { ...previousTask, status });
      }

      return { previousTask, projectCacheSnapshots };
    },
    onError: (_, { id }, context) => {
      if (context?.previousTask) qc.setQueryData(taskKeys.detail(id), context.previousTask);
      context?.projectCacheSnapshots?.forEach(({ queryKey, data }) => qc.setQueryData(queryKey, data));
    },
    onSettled: (data, _, { id }) => {
      if (data) propagateTaskResponse(qc, data);
      qc.invalidateQueries({ queryKey: taskKeys.detail(id) });
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
      qc.invalidateQueries({ queryKey: taskKeys.stats() });
      setTimeout(() => { qc.invalidateQueries({ queryKey: activityKeys.task(id) }); }, 800);
    },
    retry: MAX_RETRY_ATTEMPTS,
    retryDelay: (attempt) => getRetryDelay(attempt),
  });
}

export function useUpdateTaskPriority() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, priority }: { id: string; priority: Task["priority"] }) => {
      const response = await api.patch<Task>(`/api/v1/tasks/${id}/priority`, { priority }, { showSuccessToast: false });
      return response?.data;
    },
    onMutate: async ({ id, priority }) => {
      await qc.cancelQueries({ queryKey: taskKeys.detail(id) });
      await qc.cancelQueries({ queryKey: taskKeys.lists() });

      const previousTask = qc.getQueryData<Task>(taskKeys.detail(id));

      if (previousTask) {
        qc.setQueryData<Task>(taskKeys.detail(id), { ...previousTask, priority });
      }

      qc.getQueriesData({ queryKey: taskKeys.lists() }).forEach(([queryKey, listData]) => {
        if (!listData || typeof listData !== "object" || !("data" in listData)) return;
        const tasks = (listData as { data: Task[] }).data;
        const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, priority } : t));
        qc.setQueryData(queryKey, { ...listData, data: updatedTasks });
      });

      return { previousTask };
    },
    onError: (_, { id }, context) => {
      if (context?.previousTask) qc.setQueryData(taskKeys.detail(id), context.previousTask);
    },
    onSettled: (data, _, { id }) => {
      if (data) propagateTaskResponse(qc, data);
      qc.invalidateQueries({ queryKey: taskKeys.detail(id) });
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    retry: MAX_RETRY_ATTEMPTS,
    retryDelay: (attempt) => getRetryDelay(attempt),
  });
}
