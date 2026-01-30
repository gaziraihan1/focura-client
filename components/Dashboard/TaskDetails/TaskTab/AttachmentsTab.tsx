import { ChangeEvent } from "react";
import { Paperclip, Download, X, Loader2, Lock } from "lucide-react";
import { Attachment } from "@/types/task.types";
import { formatFileSize } from "@/utils/task.utils";
import { useDeleteAttachment, useUploadAttachment } from "@/hooks/useTask";

interface AttachmentsTabProps {
  taskId: string;
  attachments: Attachment[];
  currentUserId?: string;
  canComment?: boolean;
  uploadAttachment: ReturnType<typeof useUploadAttachment>;
    deleteAttachment: ReturnType<typeof useDeleteAttachment>;
}

export const AttachmentsTab = ({
  taskId,
  attachments,
  currentUserId,
  canComment = true,
  uploadAttachment,
  deleteAttachment,
}: AttachmentsTabProps) => {
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!canComment) return;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAttachment.mutateAsync({ taskId, file });
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  return (
    <div className="space-y-4">
      {canComment ? (
        <div>
          <label className="block">
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploadAttachment.isPending}
              className="hidden"
            />
            <div className="px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary transition cursor-pointer text-center">
              {uploadAttachment.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
              ) : (
                <>
                  <Paperclip className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload a file
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
      ) : (
        <div className="rounded-lg bg-muted/50 border border-border p-4 flex items-center gap-3">
          <Lock size={16} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            You don&apos;t have permission to upload attachments
          </p>
        </div>
      )}

      {attachments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No attachments yet
        </p>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => {
            const isOwnAttachment = attachment.uploadedBy.id === currentUserId;

            return (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-border gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Paperclip
                    size={16}
                    className="text-muted-foreground shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate text-sm">
                      {attachment.fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.fileSize)} •{" "}
                      {attachment.uploadedBy.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={attachment.fileUrl}
                    download
                    className="p-2 rounded-lg hover:bg-accent transition"
                  >
                    <Download size={16} className="text-foreground" />
                  </a>
                  {isOwnAttachment && (
                    <button
                      onClick={() =>
                        deleteAttachment.mutate({
                          taskId,
                          attachmentId: attachment.id,
                        })
                      }
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
