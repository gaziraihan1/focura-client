import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { taskKeys, commentKeys, taskOverviewKeys } from "../taskKeys";
import { activityKeys } from "../useActivity";
import { TaskComment } from "@/types/task.types";
import { getRetryDelay } from "./utils";

export function useAddComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, content, parentId, workspaceSlug }: { taskId: string; content: string; parentId?: string | null; workspaceSlug: string }) => {
      const response = await api.post<TaskComment>(`/api/v1/tasks/${taskId}/comments`, { content, parentId: parentId ?? null, workspaceSlug }, { showSuccessToast: false });
      return response?.data;
    },
    onMutate: async ({ taskId, content, parentId }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: commentKeys.byTask(taskId) }),
        qc.cancelQueries({ queryKey: taskOverviewKeys.detail(taskId) }),
      ]);

      const previousComments = qc.getQueryData<TaskComment[]>(commentKeys.byTask(taskId));
      const optimisticId = `optimistic-comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const optimisticComment: TaskComment = {
        id: optimisticId,
        content,
        createdAt: new Date().toISOString(),
        user: { id: "current-user", name: "You", email: "" },
        parentId: parentId ?? null,
        edited: false,
      };

      qc.setQueryData<TaskComment[]>(commentKeys.byTask(taskId), (old) => {
        if (!old) return [optimisticComment];
        return [...old, optimisticComment];
      });

      return { previousComments, optimisticId };
    },
    onError: (_err, { taskId }, context) => {
      if (context?.previousComments) {
        qc.setQueryData(commentKeys.byTask(taskId), context.previousComments);
      }
    },
    onSuccess: (newComment, { taskId }, context) => {
      if (newComment) {
        qc.setQueryData<TaskComment[]>(commentKeys.byTask(taskId), (old) => {
          if (!old) return [newComment];
          if (old.some((c) => c.id === newComment.id)) return old;
          const hasOptimistic = old.some((c) => c.id === context?.optimisticId);
          if (!hasOptimistic) return [...old, newComment];
          return old.map((c) => (c.id === context?.optimisticId ? newComment : c));
        });
      }
      qc.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      qc.invalidateQueries({ queryKey: activityKeys.task(taskId) });
    },
    retry: 1,
    retryDelay: (attempt) => getRetryDelay(attempt),
  });
}
