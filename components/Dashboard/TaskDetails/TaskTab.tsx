import { useState } from "react";
import {
  MessageSquare,
  Activity,
  Paperclip,
  Send,
  Download,
  X,
  Loader2,
  Edit2,
  Trash2,
  Check,
  Lock,
} from "lucide-react";
import { Task, Comment, Activity as ActivityType, Attachment } from "@/types/task.types";
import { formatFileSize } from "@/utils/task.utils";
import { useSession } from "next-auth/react";

interface TaskTabsProps {
  taskId: string;
  comments: Comment[];
  activities: ActivityType[];
  attachments: Attachment[];
  task: Task;
  addComment: any;
  updateComment: any;
  deleteComment: any;
  uploadAttachment: any;
  deleteAttachment: any;
  canComment?: boolean; // NEW: Permission prop
}

export const TaskTabs = ({
  taskId,
  comments,
  activities,
  attachments,
  task,
  addComment,
  updateComment,
  deleteComment,
  uploadAttachment,
  deleteAttachment,
  canComment = true, // NEW: Default to true for backwards compatibility
}: TaskTabsProps) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [activeTab, setActiveTab] = useState<
    "comments" | "activity" | "attachments"
  >("comments");
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleAddComment = async () => {
    if (!commentText.trim() || !canComment) return;

    try {
      await addComment.mutateAsync({
        taskId,
        content: commentText,
      });
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleEdit = (comment: Comment) => {
    // NEW: Only allow editing own comments
    if (comment.user.id !== currentUserId) return;
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  const handleUpdate = async (commentId: string) => {
    if (!editText.trim()) return;
    await updateComment.mutateAsync({ commentId, content: editText, taskId });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleCommentDelete = async (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await deleteComment.mutateAsync({ commentId, taskId });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canComment) return; // NEW: Check permission before upload
    
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAttachment.mutateAsync({ taskId, file });
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      {/* Horizontally scrollable tabs */}
      <div className="border-b border-border overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max">
          {[
            {
              id: "comments",
              label: "Comments",
              icon: MessageSquare,
              count: comments.length,
            },
            {
              id: "activity",
              label: "Activity",
              icon: Activity,
              count: activities.length,
            },
            {
              id: "attachments",
              label: "Attachments",
              icon: Paperclip,
              count: attachments.length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as "comments" | "activity" | "attachments")
              }
              className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary/5 text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === "comments" && (
          <div className="space-y-4">
            {/* NEW: Show comment input only if user has permission */}
            {canComment ? (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium shrink-0">
                  {task.createdBy.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground resize-none focus:ring-2 ring-primary outline-none"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || addComment.isPending}
                    className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {addComment.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Comment
                  </button>
                </div>
              </div>
            ) : (
              // NEW: Show locked message if no permission
              <div className="rounded-lg bg-muted/50 border border-border p-4 flex items-center gap-3">
                <Lock size={16} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  You don&apos;t have permission to comment on this task
                </p>
              </div>
            )}

            <div className="space-y-4 mt-6">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => {
                  // NEW: Check if current user owns this comment
                  const isOwnComment = comment.user.id === currentUserId;
                  
                  return (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium shrink-0">
                        {comment.user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 justify-between">
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-foreground">
                              {comment.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2 block sm:inline">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {/* NEW: Only show edit/delete for own comments */}
                          {isOwnComment && (
                            <div className="flex gap-2 shrink-0">
                              <Edit2
                                className="cursor-pointer text-muted-foreground hover:text-foreground"
                                size={16}
                                onClick={() => handleEdit(comment)}
                              />
                              <Trash2
                                className="cursor-pointer text-red-500 hover:text-red-600"
                                size={16}
                                onClick={() => handleCommentDelete(comment.id)}
                              />
                            </div>
                          )}
                        </div>
                        {editingId === comment.id ? (
                          <div className="flex gap-2 items-center mt-1">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="flex-1 border rounded px-2 py-1 text-sm"
                            />
                            <Check
                              className="cursor-pointer text-green-500 hover:text-green-600 shrink-0"
                              size={16}
                              onClick={() => handleUpdate(comment.id)}
                            />
                            <X
                              className="cursor-pointer text-red-500 hover:text-red-600 shrink-0"
                              size={16}
                              onClick={handleCancel}
                            />
                          </div>
                        ) : (
                          <p className="text-foreground/80 wrap-break-word">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No activity yet
              </p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium shrink-0">
                    {activity.user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground/80 wrap-break-word">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "attachments" && (
          <div className="space-y-4">
            {/* NEW: Only show upload if user has permission */}
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
              // NEW: Show locked message if no permission
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
                  // NEW: Check if current user uploaded this attachment
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
                        {/* NEW: Only show delete button for own attachments */}
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
        )}
      </div>
    </div>
  );
};