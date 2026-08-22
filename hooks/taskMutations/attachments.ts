import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { taskKeys, attachmentKeys } from "../taskKeys";
import { activityKeys } from "../useActivity";
import { Attachment } from "@/types/task.types";
import { getRetryDelay } from "./utils";

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
