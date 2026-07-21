import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Task, CreateTaskDto } from "./useTask";
import { taskKeys, commentKeys, attachmentKeys } from "./taskKeys";
import { ProjectDetails, projectKeys } from "./useProjects";
import { Activity, activityKeys } from "./useActivity";
import { TaskComment } from "@/types/task.types";
import { Attachment } from "@/types/task.types";

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
    onSuccess: (data) => {
      if (data) {
        qc.setQueryData(taskKeys.detail(data.id), data);
        qc.invalidateQueries({ queryKey: taskKeys.lists() });
        qc.invalidateQueries({ queryKey: taskKeys.stats() });
        setTimeout(() => { qc.invalidateQueries({ queryKey: activityKeys.task(data.id) }); }, 800);
      }
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await api.delete(`/api/v1/tasks/${taskId}`, { showSuccessToast: true });
      return response?.data;
    },
    onSuccess: (_, taskId) => {
      qc.removeQueries({ queryKey: taskKeys.detail(taskId) });
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
      qc.invalidateQueries({ queryKey: taskKeys.stats() });
    },
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
  });
}

export function useAddComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, content, parentId, workspaceSlug }: { taskId: string; content: string; parentId?: string | null; workspaceSlug: string }) => {
      const response = await api.post<TaskComment>(`/api/v1/tasks/${taskId}/comments`, { content, parentId: parentId ?? null, workspaceSlug }, { showSuccessToast: false });
      return response?.data;
    },
    onSuccess: (newComment, { taskId }) => {
      qc.setQueryData<TaskComment[]>(commentKeys.byTask(taskId), (old) => {
        if (!old) return [newComment!];
        if (old.some((c) => c.id === newComment!.id)) return old;
        return [...old, newComment!];
      });
      qc.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
      qc.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      setTimeout(() => { qc.invalidateQueries({ queryKey: activityKeys.task(taskId) }); }, 800);
    },
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
  });
}

export function useDeleteAttachment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, attachmentId }: { taskId: string; attachmentId: string }) => {
      const response = await api.delete(`/api/v1/tasks/${taskId}/attachments/${attachmentId}`, { showSuccessToast: true });
      return response?.data;
    },
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({ queryKey: attachmentKeys.byTask(taskId) });
      qc.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      setTimeout(() => { qc.invalidateQueries({ queryKey: activityKeys.task(taskId) }); }, 800);
    },
  });
}
