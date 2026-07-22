import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Task, CreateTaskDto } from "./useTask";
import { taskKeys, commentKeys, attachmentKeys } from "./taskKeys";
import { ProjectDetails, projectKeys } from "./useProjects";
import { Activity, activityKeys } from "./useActivity";
import { TaskComment } from "@/types/task.types";
import { Attachment } from "@/types/task.types";

const MUTATION_RETRY_DELAY = 1000;
const MAX_RETRY_ATTEMPTS = 2;

function getRetryDelay(attempt: number): number {
  return MUTATION_RETRY_DELAY * Math.pow(2, attempt);
}

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

      qc.setQueryData(projectKeys.detail(newTask.projectId), (old: ProjectDetails | undefined) => {
        if (!old) return old;
        const optimisticTask = {
          id: `optimistic-${Date.now()}`,
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

      return { previous };
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      const response = await api.put<Task>(`/api/v1/tasks/${id}`, data, { showSuccessToast: true });
      return response?.data;
    },
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: taskKeys.detail(id) });
      await qc.cancelQueries({ queryKey: taskKeys.lists() });

      const previousTask = qc.getQueryData<Task>(taskKeys.detail(id));

      if (previousTask) {
        qc.setQueryData<Task>(taskKeys.detail(id), { ...previousTask, ...data });
      }

      // Update task in all list caches
      qc.getQueriesData({ queryKey: taskKeys.lists() }).forEach(([queryKey, listData]) => {
        if (!listData || !("data" in listData)) return;
        const tasks = (listData as { data: Task[] }).data;
        const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, ...data } : t));
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
      if (data) {
        qc.setQueryData(taskKeys.detail(data.id), data);
      }
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

      // Store snapshots for rollback
      const listSnapshots: Array<{ queryKey: readonly unknown[]; data: unknown }> = [];
      qc.getQueriesData({ queryKey: taskKeys.lists() }).forEach(([queryKey, data]) => {
        listSnapshots.push({ queryKey, data });
        if (data && "data" in data) {
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
      if (data) qc.setQueryData<Task>(taskKeys.detail(id), data);
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

      // Update in all list caches
      qc.getQueriesData({ queryKey: taskKeys.lists() }).forEach(([queryKey, listData]) => {
        if (!listData || !("data" in listData)) return;
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
      if (data) qc.setQueryData<Task>(taskKeys.detail(id), data);
      qc.invalidateQueries({ queryKey: taskKeys.detail(id) });
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    retry: MAX_RETRY_ATTEMPTS,
    retryDelay: (attempt) => getRetryDelay(attempt),
  });
}

export function useAddComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, content, parentId, workspaceSlug }: { taskId: string; content: string; parentId?: string | null; workspaceSlug: string }) => {
      const response = await api.post<TaskComment>(`/api/v1/tasks/${taskId}/comments`, { content, parentId: parentId ?? null, workspaceSlug }, { showSuccessToast: false });
      return response?.data;
    },
    onMutate: async ({ taskId, content, parentId }) => {
      await qc.cancelQueries({ queryKey: commentKeys.byTask(taskId) });

      const previousComments = qc.getQueryData<TaskComment[]>(commentKeys.byTask(taskId));

      const optimisticComment: TaskComment = {
        id: `optimistic-comment-${Date.now()}`,
        content,
        taskId,
        parentId: parentId ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: { id: "current-user", name: "You", email: "" },
      };

      qc.setQueryData<TaskComment[]>(commentKeys.byTask(taskId), (old) => {
        if (!old) return [optimisticComment];
        return [...old, optimisticComment];
      });

      return { previousComments };
    },
    onError: (_err, { taskId }, context) => {
      if (context?.previousComments) {
        qc.setQueryData(commentKeys.byTask(taskId), context.previousComments);
      }
    },
    onSuccess: (newComment, { taskId }) => {
      if (newComment) {
        qc.setQueryData<TaskComment[]>(commentKeys.byTask(taskId), (old) => {
          if (!old) return [newComment];
          // Remove optimistic comment and add real one
          return old.filter((c) => !c.id.startsWith("optimistic-comment-")).concat(newComment);
        });
      }
      qc.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      setTimeout(() => { qc.invalidateQueries({ queryKey: activityKeys.task(taskId) }); }, 800);
    },
    retry: 1,
    retryDelay: (attempt) => getRetryDelay(attempt),
  });
}

export function useUploadAttachment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, file }: { taskId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.upload<Attachment>(`/api/v1/tasks/${taskId}/attachments`, formData, { showSuccessToast: true });
      return response?.data;
    },
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({ queryKey: attachmentKeys.byTask(taskId) });
      qc.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      setTimeout(() => { qc.invalidateQueries({ queryKey: activityKeys.task(taskId) }); }, 800);
    },
    retry: 1,
    retryDelay: (attempt) => getRetryDelay(attempt),
  });
}

export function useDeleteAttachment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, attachmentId }: { taskId: string; attachmentId: string }) => {
      const response = await api.delete(`/api/v1/tasks/${taskId}/attachments/${attachmentId}`, { showSuccessToast: true });
      return response?.data;
    },
    onMutate: async ({ taskId, attachmentId }) => {
      await qc.cancelQueries({ queryKey: attachmentKeys.byTask(taskId) });

      const previousAttachments = qc.getQueryData<Attachment[]>(attachmentKeys.byTask(taskId));

      if (previousAttachments) {
        qc.setQueryData<Attachment[]>(
          attachmentKeys.byTask(taskId),
          previousAttachments.filter((a) => a.id !== attachmentId)
        );
      }

      return { previousAttachments };
    },
    onError: (_err, { taskId }, context) => {
      if (context?.previousAttachments) {
        qc.setQueryData(attachmentKeys.byTask(taskId), context.previousAttachments);
      }
    },
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({ queryKey: attachmentKeys.byTask(taskId) });
      qc.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      setTimeout(() => { qc.invalidateQueries({ queryKey: activityKeys.task(taskId) }); }, 800);
    },
    retry: 1,
    retryDelay: (attempt) => getRetryDelay(attempt),
  });
}

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

      const listSnapshots: Array<{ queryKey: readonly unknown[]; data: unknown }> = [];
      const projectSnapshots: Array<{ queryKey: readonly unknown[]; data: ProjectDetails }> = [];

      // Update task lists
      qc.getQueriesData({ queryKey: taskKeys.lists() }).forEach(([queryKey, listData]) => {
        listSnapshots.push({ queryKey, data: listData });
        if (listData && "data" in listData) {
          const tasks = (listData as { data: Task[] }).data;
          const updatedTasks = tasks.map((t) =>
            taskIds.includes(t.id) ? { ...t, status } : t
          );
          qc.setQueryData(queryKey, { ...listData, data: updatedTasks });
        }
      });

      // Update project caches
      qc.getQueriesData<ProjectDetails>({ queryKey: projectKeys.all }).forEach(([queryKey, projectData]) => {
        if (!projectData?.tasks) return;
        projectSnapshots.push({ queryKey, data: projectData });
        qc.setQueryData<ProjectDetails>(queryKey, {
          ...projectData,
          tasks: projectData.tasks.map((t) =>
            taskIds.includes(t.id) ? { ...t, status } : t
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

      const listSnapshots: Array<{ queryKey: readonly unknown[]; data: unknown }> = [];
      qc.getQueriesData({ queryKey: taskKeys.lists() }).forEach(([queryKey, data]) => {
        listSnapshots.push({ queryKey, data });
        if (data && "data" in data) {
          const tasks = (data as { data: Task[] }).data;
          qc.setQueryData(queryKey, {
            ...data,
            data: tasks.filter((t) => !taskIds.includes(t.id)),
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
