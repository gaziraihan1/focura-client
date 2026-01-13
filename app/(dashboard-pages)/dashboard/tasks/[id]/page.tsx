"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, AlertCircle, Loader2, Lock } from "lucide-react";
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
import { useTaskPermissions } from "@/hooks/useTaskPermissions"; // NEW IMPORT
import { Task } from "@/types/task.types";

// Import components
import { TaskHeader } from "@/components/Dashboard/TaskDetails/TaskHeader";
import { TimeTrackingCard } from "@/components/Dashboard/TaskDetails/TimeTrackingCard";
import { FocusRequirementsCard } from "@/components/Dashboard/TaskDetails/FocusRequirementsCard";
import { TaskDetailsForm } from "@/components/Dashboard/TaskDetails/TaskDetailsForm";
import { TaskSidebar } from "@/components/Dashboard/TaskDetails/TaskSidebar";
import { TaskTabs } from "@/components/Dashboard/TaskDetails/TaskTab";
import { IntentBadge } from "@/components/Dashboard/TaskDetails/IntentBadge";

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
  
  // NEW: Get task permissions
  const permissions = useTaskPermissions(task);
  
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


  // NEW: Updated handler with permission check
  const handleStatusChange = async (status: Task["status"]) => {
    if (!task) return;
    
    // Check permission before allowing status change
    if (!permissions.canChangeStatus) {
      alert(permissions.reason || "You don't have permission to change the status of this task");
      return;
    }
    
    await updateStatus.mutateAsync({ id: task.id, status });
  };

  // NEW: Updated handler with permission check
  const handleSaveEdit = async () => {
    if (!task) return;
    
    // Check permission before allowing edit
    if (!permissions.canEdit) {
      alert(permissions.reason || "You don't have permission to edit this task");
      return;
    }

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

  // NEW: Updated handler with permission check
  const handleDelete = async () => {
    if (!task) return;
    
    // Check permission before allowing delete
    if (!permissions.canDelete) {
      alert(permissions.reason || "You don't have permission to delete this task");
      return;
    }
    
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask.mutateAsync(task.id);
      router.push("/dashboard/tasks");
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEditClick = () => {
  if (!permissions.canEdit) {
    alert(permissions.reason || "You don't have permission to edit this task");
    return;
  }

  if (task) {
    setEditData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      estimatedHours: task.estimatedHours?.toString() || "",
    });
  }

  setIsEditing(true);
};


  if (isLoading || permissions.isLoading) {
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

  // NEW: Check view permission
  if (!permissions.canView) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Lock className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground">
          You don&apos;t have permission to view this task.
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
      {/* Header - NOW WITH PERMISSION PROPS */}
      <TaskHeader
        isEditing={isEditing}
        onBack={() => router.back()}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        isDeleting={deleteTask.isPending}
        canEdit={permissions.canEdit}
        canDelete={permissions.canDelete}
      />

      {/* NEW: Permission Warning */}
      {!permissions.canEdit && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2">
          <Lock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-500">
            {permissions.reason || "You have read-only access to this task"}
          </p>
        </div>
      )}

      {/* Compact Badges Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {isPersonalTask && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-medium">
            <User size={12} />
            Personal
          </div>
        )}
        
        <IntentBadge intent={task.intent} size="sm" showLabel={true} />
      </div>

      {task.timeTracking && (
        <TimeTrackingCard
          timeTracking={task.timeTracking}
          estimatedHours={task.estimatedHours}
        />
      )}

      {task.focusRequired && (
        <FocusRequirementsCard
          focusLevel={task.focusLevel}
          energyType={task.energyType}
          distractionCost={task.distractionCost}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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

          {/* Tabs - NOW WITH PERMISSION PROP */}
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
            canComment={permissions.canComment}
          />
        </div>

        {/* Sidebar - NOW WITH PERMISSION PROP */}
        <TaskSidebar
          task={task}
          isPersonalTask={isPersonalTask}
          isUpdatingStatus={updateStatus.isPending}
          onStatusChange={handleStatusChange}
          canChangeStatus={permissions.canChangeStatus}
        />
      </div>
    </div>
  );
}