"use client";
import { m as motion } from "framer-motion";
import { Flag, Repeat, Sprout } from "lucide-react";
import { useSession } from "next-auth/react";
import { TaskDetailsForm } from "./TaskDetailsForm";
import { TaskTabs } from "./TaskTab";
import { TaskSidebar } from "./TaskSidebar";
import { Task, TaskComment, Attachment } from "@/types/task.types";
import { SubtaskSection } from "./SubtasksSection/SubtaskSection";
import { TaskSectionBadge } from "@/components/Dashboard/ProjectDetails/TaskSectionBadge";
import { EditTaskData, TaskHandlers, TaskMutations, TaskPermissionsState } from "@/types/taskDetails.types";

interface TaskDetailsMainLayoutProps {
  isPersonalTask: boolean;
  task: Task;
  workspaceSlug: string;
  isEditing: boolean;
  editData: EditTaskData;
  setIsEditing: (isEditing: boolean) => void;
  setEditData: (data: EditTaskData) => void;
  comments: TaskComment[];
  attachments: Attachment[];
  permissions: TaskPermissionsState;
  handlers: TaskHandlers;
  mutations: TaskMutations;
  sections?: Array<{ id: string; name: string; status?: string }>;
  sprints?: Array<{ id: string; name: string }>;
  milestones?: Array<{ id: string; title: string }>;
}

export default function TaskDetailsMainLayout({
  isPersonalTask,
  task,
  workspaceSlug,
  isEditing,
  editData,
  setIsEditing,
  setEditData,
  comments,
  attachments,
  permissions,
  handlers,
  mutations,
  sections,
  sprints,
  milestones,
}: TaskDetailsMainLayoutProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ?? "";

  return (
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
              sections={sections}
              sprints={sprints}
              milestones={milestones}
              isPersonalTask={isPersonalTask}
              isUpdating={mutations.updateTask.isPending}
              onEditDataChange={setEditData}
              onSave={handlers.handleSaveEdit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-foreground">
                  {task.title}
                </h1>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {!isPersonalTask && <TaskSectionBadge task={task} />}
                    {task.sprint && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400">
                        <Sprout size={10} />
                        {task.sprint.name}
                      </span>
                    )}
                    {task.milestone && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
                        <Flag size={10} />
                        {task.milestone.title}
                      </span>
                    )}
                    {task.recurrence && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400">
                        <Repeat size={10} />
                        {task.recurrence.pattern.charAt(0) +
                          task.recurrence.pattern.slice(1).toLowerCase()}
                      </span>
                    )}
                </div>
              </div>
              {task.description ? (
                <p className="text-foreground/80 whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  No description provided
                </p>
              )}
            </>
          )}
        </motion.div>

        {currentUserId && (
          <SubtaskSection
            parentTaskId={task.id}
            currentUserId={currentUserId}
            isAssignee={permissions.isAssignee || permissions.isOwner}
          />
        )}

        {!isPersonalTask && (
          <TaskTabs
            taskId={task.id}
            task={task}
            comments={comments}
            attachments={attachments}
            addComment={mutations.addComment}
            updateComment={mutations.updateComment}
            deleteComment={mutations.deleteComment}
            uploadAttachment={mutations.uploadAttachment}
            deleteAttachment={mutations.deleteAttachment}
            canComment={permissions.canComment}
            workspaceSlug={workspaceSlug}
          />
        )}
      </div>

      <TaskSidebar
        task={task}
        isPersonalTask={isPersonalTask}
        isUpdatingStatus={mutations.updateStatus.isPending}
        onStatusChange={handlers.handleStatusChange}
        canChangeStatus={permissions.canChangeStatus}
        onTaskUpdated={handlers.handleTaskUpdated}
      />
    </div>
  );
}