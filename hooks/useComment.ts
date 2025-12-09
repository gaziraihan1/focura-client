import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios'; // your axios instance
import { Comment, commentKeys } from './useTask';


interface UpdateCommentInput {
  commentId: string;
  content: string;
  taskId?: string; 
}

interface DeleteCommentInput {
  commentId: string;
  taskId: string; 
}

// Hook to update a comment
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, taskId, content }: UpdateCommentInput) => {
      const response = await api.put<Comment>(
        `/api/tasks/${taskId}/comments/${commentId}`,
        { content }
      );
      return response.data;
    },
    onSuccess: (_, { taskId, commentId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId || "") });
      queryClient.invalidateQueries({ queryKey: ['comments', commentId] });
    },
  });
}
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, taskId }: DeleteCommentInput) => {
      const response = await api.delete(`/api/tasks/${taskId}/comments/${commentId}`);
      return response.data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
    },
  });
}