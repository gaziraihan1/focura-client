// components/Tasks/CreateTaskModal/CreateTaskModal.tsx
import { X, Loader2 } from "lucide-react";
import { useProjectRoleCheck } from "@/hooks/useProjects";
import { LabelPicker } from "@/components/Labels/LabelPicker";
import { FocusEnergySection } from "@/components/Tasks/form/FocusEnergySection";
import { useCreateTaskModal } from "@/hooks/useCreateTaskModal";
import { TaskTitleInput } from "./TaskModal/TaskTitleInput";
import { TaskDescriptionInput } from "./TaskModal/TaskDescriptionInput";
import { TaskIntentPicker } from "./TaskModal/TaskIntentPicker";
import { TaskPriorityPicker } from "./TaskModal/TaskPriorityPicker";
import { TaskDueDateInput } from "./TaskModal/TaskDueDateInput";
import { TaskEstimatedHoursInput } from "./TaskModal/TaskEstimatedHoursInput";
import { TaskAssigneePicker } from "./TaskModal/TaskAssigneePicker";
import { CreateTaskModalProps } from "@/types/taskForm.types";

export default function CreateTaskModal({
  projectId,
  workspaceId,
  projectMembers,
  onClose,
}: CreateTaskModalProps) {
  const { isManagerOrAdmin } = useProjectRoleCheck(projectId);

  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    toggleAssignee,
    handleSubmit,
  } = useCreateTaskModal({ projectId, onClose });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 max-w-2xl w-full border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Create Project Task
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <TaskTitleInput
            value={formData.title}
            onChange={(value) => updateField("title", value)}
            error={errors.title}
          />

          {/* Description */}
          <TaskDescriptionInput
            value={formData.description || ""}
            onChange={(value) => updateField("description", value)}
          />

          {/* Intent */}
          <TaskIntentPicker
            value={formData.intent}
            onChange={(value) => updateField("intent", value)}
          />

          {/* Focus & Energy */}
          <FocusEnergySection
            focusRequired={formData.focusRequired}
            focusLevel={formData.focusLevel}
            energyType={formData.energyType}
            distractionCost={formData.distractionCost}
            onFocusRequiredChange={(value) =>
              updateField("focusRequired", value)
            }
            onFocusLevelChange={(value) => updateField("focusLevel", value)}
            onEnergyTypeChange={(value) => updateField("energyType", value)}
            onDistractionCostChange={(value) =>
              updateField("distractionCost", value)
            }
          />

          {/* Estimated Hours */}
          <TaskEstimatedHoursInput
            value={formData.estimatedHours}
            onChange={(value) => updateField("estimatedHours", value)}
          />

          {/* Priority */}
          <TaskPriorityPicker
            value={formData.priority}
            onChange={(value) => updateField("priority", value)}
          />

          {/* Due Date */}
          <TaskDueDateInput
            value={formData.dueDate}
            onChange={(value) => updateField("dueDate", value)}
          />

          {/* Labels */}
          <div>
            <LabelPicker
              workspaceId={workspaceId}
              selectedLabelIds={formData.labelIds || []}
              onChange={(labelIds) => updateField("labelIds", labelIds)}
              maxLabels={10}
            />
          </div>

          {/* Assignees */}
          {isManagerOrAdmin && (
            <TaskAssigneePicker
              projectMembers={projectMembers}
              selectedUserIds={formData.assigneeIds}
              onToggle={toggleAssignee}
            />
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-accent transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}