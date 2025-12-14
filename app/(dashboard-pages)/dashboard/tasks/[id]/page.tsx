"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  Calendar,
  User,
  Folder,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Send,
  Download,
  X,
  Loader2,
  Activity,
  Check,
  Edit2,
  Timer,
  TrendingUp,
  Hourglass,
} from "lucide-react";
import Link from "next/link";

import {
  useTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
  useTaskComments,
  useAddComment,
  useTaskActivity,
  useTaskAttachments,
  useUploadAttachment,
  useDeleteAttachment,
  type Task as TaskFromHook,
  type Comment as CommentFromHook,
} from "@/hooks/useTask";
import { useDeleteComment, useUpdateComment } from "@/hooks/useComment";

export interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
}

export interface TimeTracking {
  hoursSinceCreation: number;
  hoursUntilDue: number | null;
  isOverdue: boolean;
  isDueToday: boolean;
  timeProgress: number | null;
}

export type Task = TaskFromHook & {
  timeTracking?: TimeTracking;
};

// Helper functions
const formatTimeDuration = (hours: number) => {
  if (hours < 0) {
    const absHours = Math.abs(hours);
    if (absHours < 24) return `${absHours}h overdue`;
    const days = Math.floor(absHours / 24);
    const remainingHours = absHours % 24;
    return `${days}d ${remainingHours}h overdue`;
  }

  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h`;
};

const getTimeStatusColor = (timeTracking: TimeTracking | undefined) => {
  if (!timeTracking) return "text-gray-500";

  if (timeTracking.isOverdue) return "text-red-500 bg-red-500/10";
  if (timeTracking.isDueToday) return "text-orange-500 bg-orange-500/10";
  if (timeTracking.hoursUntilDue !== null && timeTracking.hoursUntilDue < 24) {
    return "text-orange-500 bg-orange-500/10";
  }
  return "text-blue-500 bg-blue-500/10";
};

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [activeTab, setActiveTab] = useState<
    "comments" | "activity" | "attachments"
  >("comments");
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    estimatedHours: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const { data: taskData, isLoading, isError } = useTask(taskId);
  const task = taskData as Task | undefined;
  const { data: comments = [] } = useTaskComments(taskId);
  const { data: activities = [] } = useTaskActivity(taskId);
  const { data: attachments = [] } = useTaskAttachments(taskId);

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const updateStatus = useUpdateTaskStatus();
  const addComment = useAddComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const uploadAttachment = useUploadAttachment();
  const deleteAttachment = useDeleteAttachment();

  useEffect(() => {
    if (task) {
      setEditData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        estimatedHours: task.estimatedHours?.toString() || "",
      });
    }
  }, [task]);

  const handleStatusChange = async (status: Task["status"]) => {
    if (!task) return;
    await updateStatus.mutateAsync({ id: task.id, status });
  };

  const handleSaveEdit = async () => {
    if (!task) return;

    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: {
          title: editData.title,
          description: editData.description,
          priority: editData.priority as Task["priority"],
          status: editData.status as Task["status"],
          estimatedHours: editData.estimatedHours
            ? parseFloat(editData.estimatedHours)
            : undefined,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async () => {
    if (!task || !confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask.mutateAsync(task.id);
      router.push("/dashboard/tasks");
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

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

  const handleEdit = (comment: CommentFromHook) => {
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
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAttachment.mutateAsync({ taskId, file });
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      TODO: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      IN_REVIEW: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      BLOCKED: "bg-red-500/10 text-red-500 border-red-500/20",
      COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
      CANCELLED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    };
    return colors[status] || "bg-gray-500/10 text-gray-500";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
      HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      MEDIUM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      LOW: "bg-green-500/10 text-green-500 border-green-500/20",
    };
    return colors[priority] || "bg-gray-500/10 text-gray-500";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-foreground">Task not found</h2>
        <p className="text-muted-foreground">
          The task you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/dashboard/tasks"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg hover:bg-accent transition"
              >
                <Edit size={18} className="text-foreground" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteTask.isPending}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                {deleteTask.isPending ? (
                  <Loader2 size={18} className="animate-spin text-red-500" />
                ) : (
                  <Trash2 size={18} className="text-red-500" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
      {task.timeTracking && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border-2 p-4 ${getTimeStatusColor(
            task.timeTracking
          )}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <div>
                  <p className="text-xs opacity-75">Time Elapsed</p>
                  <p className="font-bold">
                    {formatTimeDuration(task.timeTracking.hoursSinceCreation)}
                  </p>
                </div>
              </div>

              {task.timeTracking.hoursUntilDue !== null && (
                <div className="flex items-center gap-2">
                  <Hourglass className="w-5 h-5" />
                  <div>
                    <p className="text-xs opacity-75">Time Remaining</p>
                    <p className="font-bold">
                      {task.timeTracking.isOverdue
                        ? formatTimeDuration(task.timeTracking.hoursUntilDue)
                        : formatTimeDuration(task.timeTracking.hoursUntilDue)}
                    </p>
                  </div>
                </div>
              )}

              {task.estimatedHours &&
                task.timeTracking.timeProgress !== null && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <div>
                      <p className="text-xs opacity-75">Progress</p>
                      <p className="font-bold">
                        {task.timeTracking.timeProgress}%
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {task.estimatedHours && task.timeTracking.timeProgress !== null && (
              <div className="flex-1 min-w-[200px] max-w-md">
                <div className="w-full h-3 bg-background/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      task.timeTracking.timeProgress > 100
                        ? "bg-red-600"
                        : task.timeTracking.timeProgress > 80
                        ? "bg-orange-500"
                        : "bg-current"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        task.timeTracking.timeProgress
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs mt-1 opacity-75">
                  {task.timeTracking.hoursSinceCreation}h /{" "}
                  {task.estimatedHours}h estimated
                </p>
              </div>
            )}

            {task.timeTracking.isOverdue && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Overdue</span>
              </div>
            )}

            {task.timeTracking.isDueToday && !task.timeTracking.isOverdue && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Due Today</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-card border border-border p-6"
          >
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-xl font-bold focus:ring-2 ring-primary outline-none"
                />

                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground resize-none focus:ring-2 ring-primary outline-none"
                  placeholder="Add description..."
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={editData.estimatedHours}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        estimatedHours: e.target.value,
                      }))
                    }
                    min="0"
                    step="0.5"
                    placeholder="e.g., 8"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEdit}
                    disabled={updateTask.isPending}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {updateTask.isPending && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {task.title}
                </h1>

                {task.description && (
                  <p className="text-foreground/80 whitespace-pre-wrap">
                    {task.description}
                  </p>
                )}

                {!task.description && (
                  <p className="text-muted-foreground italic">
                    No description provided
                  </p>
                )}
              </div>
            )}
          </motion.div>

          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="flex border-b border-border">
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
                    setActiveTab(
                      tab.id as "comments" | "activity" | "attachments"
                    )
                  }
                  className={`flex-1 px-4 py-3 text-sm font-medium transition flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-primary/5 text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "comments" && (
                <div className="space-y-4">
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

                  <div className="space-y-4 mt-6">
                    {comments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No comments yet. Be the first to comment!
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium shrink-0">
                            {comment.user.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 justify-between">
                              <div>
                                <span className="font-medium text-foreground">
                                  {comment.user.name}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Edit2
                                  className="cursor-pointer text-muted-foreground hover:text-foreground"
                                  size={16}
                                  onClick={() => handleEdit(comment)}
                                />
                                <Trash2
                                  className="cursor-pointer text-red-500 hover:text-red-600"
                                  size={16}
                                  onClick={() =>
                                    handleCommentDelete(comment.id)
                                  }
                                />
                              </div>
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
                                  className="cursor-pointer text-green-500 hover:text-green-600"
                                  size={16}
                                  onClick={() => handleUpdate(comment.id)}
                                />
                                <X
                                  className="cursor-pointer text-red-500 hover:text-red-600"
                                  size={16}
                                  onClick={handleCancel}
                                />
                              </div>
                            ) : (
                              <p className="text-foreground/80">
                                {comment.content}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
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
                        <div className="flex-1">
                          <p className="text-foreground/80">
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

                  {attachments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No attachments yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Paperclip
                              size={16}
                              className="text-muted-foreground shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-card border border-border p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as Task["status"])
                }
                disabled={updateStatus.isPending}
                className={`w-full px-4 py-2 rounded-lg border ${getStatusColor(
                  task.status
                )} font-medium focus:ring-2 ring-primary outline-none disabled:opacity-50`}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="BLOCKED">Blocked</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              <div
                className={`px-4 py-2 rounded-lg border ${getPriorityColor(
                  task.priority
                )} font-medium text-center`}
              >
                {task.priority}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-card border border-border p-6 space-y-4"
          >
            <h3 className="font-semibold text-foreground mb-4">Details</h3>

            {task.project && (
              <div className="flex items-center gap-3">
                <Folder size={16} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Project</p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: task.project.color }}
                  >
                    {task.project.name}
                  </p>
                </div>
              </div>
            )}

            {task.estimatedHours && (
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    Estimated Hours
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {task.estimatedHours}h
                  </p>
                </div>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <User size={16} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Created By</p>
                <p className="text-sm font-medium text-foreground">
                  {task.createdBy.name}
                </p>
              </div>
            </div>

            {task.assignees.length > 0 && (
              <div className="flex items-start gap-3">
                <User size={16} className="text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2">
                    Assignees
                  </p>
                  <div className="space-y-2">
                    {task.assignees.map((assignee) => (
                      <div
                        key={assignee.user.id}
                        className="flex items-center gap-2"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                          {assignee.user.name.charAt(0)}
                        </div>
                        <span className="text-sm text-foreground">
                          {assignee.user.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Clock size={14} />
                Created {new Date(task.createdAt).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
