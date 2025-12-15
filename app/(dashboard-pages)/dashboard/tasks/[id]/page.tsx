"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, AlertCircle, Loader2 } from "lucide-react";
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
} from "@/hooks/useTask";
import { useDeleteComment, useUpdateComment } from "@/hooks/useComment";
import { Task } from "@/types/task.types";

// Import components
import { TaskHeader } from "@/components/Dashboard/TaskDetails/TaskHeader";
import { TimeTrackingCard } from "@/components/Dashboard/TaskDetails/TimeTrackingCard";
import { FocusRequirementsCard } from "@/components/Dashboard/TaskDetails/FocusRequirementsCard";
import { TaskDetailsForm } from "@/components/Dashboard/TaskDetails/TaskDetailsForm";
import { TaskSidebar } from "@/components/Dashboard/TaskDetails/TaskSidebar";
import { TaskTabs } from "@/components/Dashboard/TaskDetails/TaskTab";

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    estimatedHours: "",
  });

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

  const isPersonalTask = !task?.projectId;

  // Update editData when task ID changes
  useEffect(() => {
    if (task) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        estimatedHours: task.estimatedHours?.toString() || "",
      });
    }
  }, [task, task?.id]);

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
      {/* Header */}
      <TaskHeader
        isEditing={isEditing}
        onBack={() => router.back()}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
        isDeleting={deleteTask.isPending}
      />

      {/* Task Type Badge */}
      {isPersonalTask && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium">
          <User size={14} />
          Personal Task
        </div>
      )}

      {/* Time Tracking Info */}
      {task.timeTracking && (
        <TimeTrackingCard
          timeTracking={task.timeTracking}
          estimatedHours={task.estimatedHours}
        />
      )}

      {/* Focus Features Card */}
      {task.focusRequired && (
        <FocusRequirementsCard
          focusLevel={task.focusLevel}
          energyType={task.energyType}
          distractionCost={task.distractionCost}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-card border border-border p-6"
          >
            {isEditing ? (
              <TaskDetailsForm
                editData={editData}
                isUpdating={updateTask.isPending}
                onEditDataChange={setEditData}
                onSave={handleSaveEdit}
                onCancel={() => setIsEditing(false)}
              />
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

          {/* Tabs */}
          <TaskTabs
            taskId={taskId}
            comments={comments}
            activities={activities}
            attachments={attachments}
            task={task}
            addComment={addComment}
            updateComment={updateComment}
            deleteComment={deleteComment}
            uploadAttachment={uploadAttachment}
            deleteAttachment={deleteAttachment}
          />
        </div>

        {/* Sidebar */}
        <TaskSidebar
          task={task}
          isPersonalTask={isPersonalTask}
          isUpdatingStatus={updateStatus.isPending}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}