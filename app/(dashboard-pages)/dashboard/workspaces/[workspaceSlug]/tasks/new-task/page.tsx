"use client";

import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";


import { WorkspaceTaskFormHeader } from "@/components/Dashboard/WorkspaceNewTask/WorkspaceTaskFormHeader";
import { BasicInformationSection } from "@/components/Dashboard/WorkspaceNewTask/BasicInformationSection";
import { TaskDetailsSection } from "@/components/Dashboard/WorkspaceNewTask/TaskDetailsSection";
import { TeamLabelsSection } from "@/components/Dashboard/WorkspaceNewTask/TeamLabelsSection";
import { FormActions } from "@/components/Dashboard/WorkspaceNewTask/FormActions";
import { LabelManagerModal } from "@/components/Dashboard/WorkspaceNewTask/LabelManagerModal";
import { LoadingState } from "@/components/Shared/LoadingState";
import { useWorkspaceNewTaskPage } from "@/hooks/useWorkspaceNewTaskPage";

export default function WorkspaceNewTaskPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();

  const controller = useWorkspaceNewTaskPage({
    workspaceSlug,
  });
  console.log(controller)

  if (controller.workspaceLoading) {
    return <LoadingState />;
  }

  if (!controller.workspace) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto text-red-500" />
        <p>Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <WorkspaceTaskFormHeader
        workspaceName={controller.workspace.name}
        onCancel={controller.handleCancel}
      />

      <form
        onSubmit={controller.handleSubmit}
        className="space-y-6"
      >
        <BasicInformationSection
          title={controller.formData.title}
          description={controller.formData.description}
          projectId={controller.formData.projectId}
          projects={controller.projects}
          projectsLoading={controller.projectsLoading}
          errors={controller.errors}
          workspaceSlug={workspaceSlug}
          onTitleChange={(title) =>
            controller.setFormData((p) => ({
              ...p,
              title,
            }))
          }
          onDescriptionChange={(description) =>
            controller.setFormData((p) => ({
              ...p,
              description,
            }))
          }
          onProjectChange={(projectId) =>
            controller.setFormData((p) => ({
              ...p,
              projectId,
            }))
          }
        />

        <TaskDetailsSection
  {...controller.formData}
  errors={controller.errors}
  onStatusChange={(status) =>
    controller.setFormData((p) => ({
      ...p,
      status,
    }))
  }
  onPriorityChange={(priority) =>
    controller.setFormData((p) => ({
      ...p,
      priority,
    }))
  }
  onIntentChange={(intent) =>
    controller.setFormData((p) => ({
      ...p,
      intent,
    }))
  }
  onEnergyTypeChange={(energyType) =>
    controller.setFormData((p) => ({
      ...p,
      energyType,
    }))
  }
  onFocusRequiredChange={(focusRequired) =>
    controller.setFormData((p) => ({
      ...p,
      focusRequired,
    }))
  }
  onFocusLevelChange={(focusLevel) =>
    controller.setFormData((p) => ({
      ...p,
      focusLevel,
    }))
  }
  onDistractionCostChange={(distractionCost) =>
    controller.setFormData((p) => ({
      ...p,
      distractionCost,
    }))
  }
  onStartDateChange={(startDate) =>
    controller.setFormData((p) => ({
      ...p,
      startDate,
    }))
  }
  onDueDateChange={(dueDate) =>
    controller.setFormData((p) => ({
      ...p,
      dueDate,
    }))
  }
  onEstimatedHoursChange={(estimatedHours) =>
    controller.setFormData((p) => ({
      ...p,
      estimatedHours,
    }))
  }
/>

        <TeamLabelsSection
          members={controller.members}
          membersLoading={controller.membersLoading}
          assigneeIds={controller.formData.assigneeIds}
          labelIds={controller.formData.labelIds}
          workspaceId={controller.workspace.id}
          projectId={controller.formData.projectId}
          canAssignToOthers={controller.canAssignToOthers}
          currentUserId={controller.currentUserId}
          onToggleAssignee={controller.toggleAssignee}
          onLabelChange={(labelIds) =>
            controller.setFormData((p) => ({
              ...p,
              labelIds,
            }))
          }
          onOpenLabelManager={() =>
            controller.setShowLabelManager(true)
          }
        />

        <FormActions
          isLoading={controller.isLoading}
          canSubmit={controller.projects.length > 0}
          onCancel={controller.handleCancel}
        />
      </form>

      {controller.showLabelManager && (
        <LabelManagerModal
          workspaceId={controller.workspace.id}
          onClose={() =>
            controller.setShowLabelManager(false)
          }
        />
      )}
    </div>
  );
}
