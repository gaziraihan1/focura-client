import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useTask,            // reads from cache seeded by useTaskOverview
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
  useTaskComments,    // reads from cache seeded by useTaskOverview
  useTaskAttachments, // reads from cache seeded by useTaskOverview
  useAddComment,
  useUploadAttachment,
  useDeleteAttachment,
} from "@/hooks/useTask";
import { useUpdateComment, useDeleteComment } from "@/hooks/useComment";
import { useTaskPermissions } from "@/hooks/useTaskPermissions";
import {
  useProjectMilestones,
  useProjectSections,
  useProjectSprints,
} from "@/hooks/useProjectFeatures";
import { Task } from "@/types/task.types";
import { taskKeys, taskOverviewKeys } from "./taskKeys";
import { EMPTY_REPEAT } from "@/components/Tasks/form/RepeatControl";
import type { EditTaskData } from "@/types/taskDetails.types";

export function useTaskDetailsController(taskId: string, workspaceSlug: string ) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditTaskData>({
    title: "",
    description: "",
    priority: "",
    status: "",
    estimatedHours: "",
    sectionId: "",
    sprintId: "",
    milestoneId: "",
    startDate: "",
    dueDate: "",
    recurrence: EMPTY_REPEAT,
  });

  const taskQuery       = useTask(taskId);
  const task            = taskQuery.data as Task | undefined;

  // M1 options (sections / sprints / milestones) for the edit form.
  const projectId = task?.projectId ?? undefined;
  const { data: sections }        = useProjectSections(projectId);
  const { data: sprintStats }     = useProjectSprints(projectId);
  const { data: milestoneStats }  = useProjectMilestones(projectId);
  const sprints    = sprintStats?.sprints ?? [];
  const milestones = milestoneStats?.milestones ?? [];

  // Auto-refresh task data every 10 seconds to catch webhook updates
  useEffect(() => {
    const interval = setInterval(() => {
      taskQuery.refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [taskQuery]);
  const commentsQuery   = useTaskComments(taskId);
  const attachmentsQuery = useTaskAttachments(taskId);

  const permissions = useTaskPermissions(task);

  const updateTask       = useUpdateTask();
  const deleteTask       = useDeleteTask();
  const updateStatus     = useUpdateTaskStatus();
  const addComment       = useAddComment();
  const updateComment    = useUpdateComment();
  const deleteComment    = useDeleteComment();
  const uploadAttachment = useUploadAttachment();
  const deleteAttachment = useDeleteAttachment();

  const handleEditClick = () => {
    if (!task || !permissions.canEdit) return;
    setEditData({
      title:          task.title,
      description:    task.description || "",
      priority:       task.priority,
      status:         task.status,
      estimatedHours: task.estimatedHours?.toString() || "",
      sectionId:      task.sectionId ?? "",
      sprintId:       task.sprintId ?? "",
      milestoneId:    task.milestoneId ?? "",
      startDate:      task.startDate?.slice(0, 10) ?? "",
      dueDate:        task.dueDate?.slice(0, 10) ?? "",
      recurrence: task.recurrence
        ? {
            pattern:  task.recurrence.pattern,
            interval: task.recurrence.interval,
            days:     task.recurrence.days ?? [],
            endsAt:   task.recurrence.endsAt ?? "",
          }
        : EMPTY_REPEAT,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!task || !permissions.canEdit) return;

    // "yyyy-MM-dd" from the date input → ISO string the API stores (UTC midnight);
    // empty → null (clears the date).
    const toIso = (v?: string) =>
      v ? new Date(`${v}T00:00:00Z`).toISOString() : null;

    // Only touch the recurrence when the user actually changed it: pattern NONE
    // + no existing recurrence → omit (no-op), NONE + existing → stop (null),
    // otherwise → upsert the chosen schedule.
    const nextRecurrence =
      editData.recurrence.pattern === "NONE"
        ? task.recurrence
          ? null
          : undefined
        : {
            pattern:  editData.recurrence.pattern,
            interval: editData.recurrence.interval,
            days:
              editData.recurrence.days.length > 0
                ? editData.recurrence.days
                : undefined,
            endsAt: editData.recurrence.endsAt || undefined,
          };

    await updateTask.mutateAsync({
      id:   task.id,
      data: {
        title:          editData.title,
        description:    editData.description,
        priority:       editData.priority as Task["priority"],
        status:         editData.status   as Task["status"],
        estimatedHours: editData.estimatedHours
          ? parseFloat(editData.estimatedHours)
          : undefined,
        sectionId:    editData.sectionId || null,
        sprintId:     editData.sprintId || null,
        milestoneId:  editData.milestoneId || null,
        startDate:    toIso(editData.startDate),
        dueDate:      toIso(editData.dueDate),
        ...(nextRecurrence !== undefined && { recurrence: nextRecurrence }),
      },
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!task || !permissions.canDelete) return;

    await deleteTask.mutateAsync(task.id);
    router.push(
      workspaceSlug
        ? `/dashboard/workspaces/${workspaceSlug}/tasks`
        : "/dashboard/tasks",
    );
  };

  return {
    task,
    taskQuery,
    comments:    commentsQuery.data    ?? [],
    attachments: attachmentsQuery.data ?? [],
    permissions,
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    sections,
    sprints,
    milestones,
    handlers: {
      handleEditClick,
      handleSaveEdit,
      handleDelete,
      handleStatusChange: (status: Task["status"]) => {
    if (!permissions.canChangeStatus) return;
    return updateStatus.mutateAsync({ id: taskId, status });
  },
  handleAddComment: async (content: string) => {
    if (!permissions.canComment) return;
    await addComment.mutateAsync({ taskId, content, workspaceSlug });
  },
  handleTaskUpdated: () => {
    // Invalidate all task-related queries to force immediate refetch
    queryClient.invalidateQueries({ queryKey: taskKeys.all });
    queryClient.invalidateQueries({ queryKey: taskOverviewKeys.detail(taskId) });
  },
    },
    mutations: {
      addComment,
      updateComment,
      deleteComment,
      uploadAttachment,
      deleteAttachment,
      updateTask,
      deleteTask,
      updateStatus,
    },
  };
}