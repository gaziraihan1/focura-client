"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

import { useCreateTask, CreateTaskDto } from "@/hooks/useTask";
import { useWorkspace, useWorkspaceMembers } from "@/hooks/useWorkspace";
import { useProjects, useProjectRole } from "@/hooks/useProjects";

type TaskFormData = Omit<CreateTaskDto, "workspaceId"> & {
  assigneeIds: string[];
  labelIds: string[];
  focusLevel: number; // Add this
  distractionCost: number; // Add this
};


interface ControllerProps {
  workspaceSlug: string;
}

export const useWorkspaceNewTaskPage = ({
  workspaceSlug,
}: ControllerProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: workspace, isLoading: workspaceLoading } =
    useWorkspace(workspaceSlug);

  const { data: projects = [], isLoading: projectsLoading } =
    useProjects(workspace?.id);

  const { data: members = [], isLoading: membersLoading } =
    useWorkspaceMembers(workspace?.id);

  const createTaskMutation = useCreateTask();

  const [showLabelManager, setShowLabelManager] = useState(false);

  const [formData, setFormData] = useState<TaskFormData>({
  title: "",
  description: "",
  projectId: "",
  status: "TODO",
  priority: "MEDIUM",
  startDate: "",
  dueDate: "",
  estimatedHours: undefined,
  assigneeIds: [],
  labelIds: [],
  intent: "EXECUTION",
  energyType: "MEDIUM",
  focusRequired: false,
  focusLevel: 3, // Add this
  distractionCost: 1, // Add this
});

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedProject = projects.find(
    (p) => p.id === formData.projectId
  );

  const { isWorkspaceAdmin, canManageProject } = useProjectRole(
    formData.projectId,
    selectedProject
  );

  const isWorkspaceOwner =
    workspace?.ownerId === session?.user?.id;

  const canAssignToOthers =
    canManageProject || isWorkspaceAdmin || isWorkspaceOwner;

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Task title is required";
    }

    if (!formData.projectId) {
      nextErrors.projectId = "Select a project";
    }

    if (
      formData.startDate &&
      formData.dueDate &&
      new Date(formData.startDate) > new Date(formData.dueDate)
    ) {
      nextErrors.dueDate = "Invalid date range";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !validateForm()) return;

    await createTaskMutation.mutateAsync({
      ...formData,
      workspaceId: workspace.id,
      projectId: formData.projectId || null,
      estimatedHours: formData.estimatedHours
        ? Number(formData.estimatedHours)
        : null,
    });

    router.push(`/dashboard/workspaces/${workspaceSlug}/tasks`);
  };

  const handleCancel = () => {
    router.push(`/dashboard/workspaces/${workspaceSlug}/tasks`);
  };

  const toggleAssignee = (userId: string) => {
    if (!canAssignToOthers && userId !== session?.user?.id) {
      toast.error("No permission to assign");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(userId)
        ? prev.assigneeIds.filter((id) => id !== userId)
        : [...prev.assigneeIds, userId],
    }));
  };

  return {
    workspace,
    projects,
    members,
    workspaceLoading,
    projectsLoading,
    membersLoading,
    isLoading:
      createTaskMutation.isPending || workspaceLoading,
    formData,
    setFormData,
    errors,
    showLabelManager,
    setShowLabelManager,
    canAssignToOthers,
    currentUserId: session?.user?.id,
    handleSubmit,
    handleCancel,
    toggleAssignee,
  };
};
