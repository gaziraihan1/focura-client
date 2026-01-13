"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Loader2, AlertCircle } from "lucide-react";

import { useCreateTask, CreateTaskDto } from "@/hooks/useTask";
import { useWorkspace, useWorkspaceMembers } from "@/hooks/useWorkspace";
import { useProjects, useProjectRole } from "@/hooks/useProjects";
import { WorkspaceTaskFormHeader } from "@/components/Dashboard/WorkspaceNewTask/WorkspaceTaskFormHeader";
import { BasicInformationSection } from "@/components/Dashboard/WorkspaceNewTask/BasicInformationSection";
import { TaskDetailsSection } from "@/components/Dashboard/WorkspaceNewTask/TaskDetailsSection";
import { TeamLabelsSection } from "@/components/Dashboard/WorkspaceNewTask/TeamLabelsSection";
import { FormActions } from "@/components/Dashboard/WorkspaceNewTask/FormActions";
import { LabelManagerModal } from "@/components/Dashboard/WorkspaceNewTask/LabelManagerModal";


type TaskFormData = Omit<CreateTaskDto, "workspaceId">;

export default function WorkspaceNewTaskPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspaceSlug as string;

  const { data: session } = useSession();
  const { data: workspace, isLoading: workspaceLoading } = useWorkspace(workspaceSlug);
  const { data: projects = [], isLoading: projectsLoading } = useProjects(workspace?.id);
  const { data: members = [], isLoading: membersLoading } = useWorkspaceMembers(workspace?.id);
  
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
    focusRequired: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get role information for the selected project
  const selectedProject = projects.find(p => p.id === formData.projectId);
  const { isWorkspaceAdmin, canManageProject } = useProjectRole(
    formData.projectId,
    selectedProject
  );

  // Check if user is workspace owner
  const isWorkspaceOwner = workspace?.ownerId === session?.user?.id;

  // User can assign to others if they are: manager of project, workspace admin, or workspace owner
  const canAssignToOthers = canManageProject || isWorkspaceAdmin || isWorkspaceOwner;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!formData.projectId) {
      newErrors.projectId = "Please select a project";
    }

    if (formData.startDate && formData.dueDate) {
      if (new Date(formData.startDate) > new Date(formData.dueDate)) {
        newErrors.dueDate = "Due date must be after start date";
      }
    }

    if (
      formData.estimatedHours !== undefined &&
      (isNaN(Number(formData.estimatedHours)) ||
        Number(formData.estimatedHours) < 0)
    ) {
      newErrors.estimatedHours = "Please enter a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !workspace) {
      toast.error("Please fix the errors");
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        ...formData,
        workspaceId: workspace.id,
        projectId: formData.projectId || null,
        estimatedHours: formData.estimatedHours
          ? Number(formData.estimatedHours)
          : null,
      });
      router.push(`/dashboard/workspaces/${workspaceSlug}/tasks`);
    } catch (error) {
      console.error("Create task error:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/workspaces/${workspaceSlug}/tasks`);
  };

  const toggleAssignee = (userId: string) => {
    // Only allow toggling if user has permission
    if (!canAssignToOthers && userId !== session?.user?.id) {
      toast.error("You don't have permission to assign tasks to others");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds?.includes(userId)
        ? prev.assigneeIds.filter((id) => id !== userId)
        : [...(prev.assigneeIds || []), userId],
    }));
  };

  const isLoading = createTaskMutation.isPending || workspaceLoading;

  if (workspaceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Workspace not found</h2>
        <p className="text-muted-foreground mb-6">
          Unable to load workspace information
        </p>
        <button
          onClick={() => router.push("/dashboard/workspaces")}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Back to Workspaces
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <WorkspaceTaskFormHeader
        workspaceName={workspace.name}
        onCancel={handleCancel}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInformationSection
          title={formData.title}
          description={formData.description}
          projectId={formData.projectId}
          projects={projects}
          projectsLoading={projectsLoading}
          errors={errors}
          workspaceSlug={workspaceSlug}
          onTitleChange={(title) => setFormData((prev) => ({ ...prev, title }))}
          onDescriptionChange={(description) =>
            setFormData((prev) => ({ ...prev, description }))
          }
          onProjectChange={(projectId) =>
            setFormData((prev) => ({ ...prev, projectId }))
          }
        />

        <TaskDetailsSection
          status={formData.status}
          priority={formData.priority}
          intent={formData.intent}
          energyType={formData.energyType}
          focusRequired={formData.focusRequired}
          startDate={formData.startDate}
          dueDate={formData.dueDate}
          estimatedHours={formData.estimatedHours}
          errors={errors}
          onStatusChange={(status) => setFormData((prev) => ({ ...prev, status }))}
          onPriorityChange={(priority) => setFormData((prev) => ({ ...prev, priority }))}
          onIntentChange={(intent) => setFormData((prev) => ({ ...prev, intent }))}
          onEnergyTypeChange={(energyType) =>
            setFormData((prev) => ({ ...prev, energyType }))
          }
          onFocusRequiredChange={(focusRequired) =>
            setFormData((prev) => ({ ...prev, focusRequired }))
          }
          onStartDateChange={(startDate) =>
            setFormData((prev) => ({ ...prev, startDate }))
          }
          onDueDateChange={(dueDate) => setFormData((prev) => ({ ...prev, dueDate }))}
          onEstimatedHoursChange={(estimatedHours) =>
            setFormData((prev) => ({ ...prev, estimatedHours }))
          }
        />

        <TeamLabelsSection
          members={members}
          membersLoading={membersLoading}
          assigneeIds={formData.assigneeIds || []}
          labelIds={formData.labelIds || []}
          workspaceId={workspace.id}
          projectId={formData.projectId}
          canAssignToOthers={canAssignToOthers}
          currentUserId={session?.user?.id}
          onToggleAssignee={toggleAssignee}
          onLabelChange={(labelIds) => setFormData((prev) => ({ ...prev, labelIds }))}
          onOpenLabelManager={() => setShowLabelManager(true)}
        />

        <FormActions
          isLoading={isLoading}
          canSubmit={projects.length > 0}
          onCancel={handleCancel}
        />
      </form>

      {showLabelManager && (
        <LabelManagerModal
          workspaceId={workspace.id}
          onClose={() => setShowLabelManager(false)}
        />
      )}
    </div>
  );
}