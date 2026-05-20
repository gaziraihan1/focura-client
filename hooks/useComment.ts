import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios'; // your axios instance
import { commentKeys } from './useTask';
import { TaskComment } from '@/types/task.types'
import { activityKeys } from './useActivity';


interface UpdateCommentInput {
  commentId: string;
  content: string;
  taskId: string; 
}

interface DeleteCommentInput {
  commentId: string;
  taskId: string; 
}

// Hook to update a comment
export function useUpdateComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, taskId, content }: UpdateCommentInput) => {
      const res = await api.put<TaskComment>(
        `/api/v1/tasks/${taskId}/comments/${commentId}`,
        { content }
      );
      return res?.data;
    },
    onSuccess: (_, { taskId, commentId }) => {
      qc.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
      qc.invalidateQueries({ queryKey: ['comments', commentId] });
      setTimeout(() => {
        qc.invalidateQueries({ queryKey: activityKeys.task(taskId) });
      }, 800);
    },
  });
}

export function useDeleteComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, taskId }: DeleteCommentInput) => {
      const response = await api.delete(`/api/v1/tasks/${taskId}/comments/${commentId}`);
      return response.data;
    },
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
    },
  });
}