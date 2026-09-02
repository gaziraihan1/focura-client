// components/Tasks/CreateTaskModal/CreateTaskModal.tsx
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useProjectRoleCheck } from "@/hooks/useProjects";
import { LabelPicker } from "@/components/dashboard/labels/LabelPicker";
import { FocusEnergySection } from "@/components/tasks/form/FocusEnergySection";
import { useCreateTaskModal } from "@/hooks/useCreateTaskModal";
import { TaskTitleInput } from "./TaskModal/TaskTitleInput";
import { TaskDescriptionInput } from "./TaskModal/TaskDescriptionInput";
import { TaskIntentPicker } from "./TaskModal/TaskIntentPicker";
import { TaskPriorityPicker } from "./TaskModal/TaskPriorityPicker";
import { TaskDueDateInput } from "./TaskModal/TaskDueDateInput";
import { TaskEstimatedHoursInput } from "./TaskModal/TaskEstimatedHoursInput";
import { TaskAssigneePicker } from "./TaskModal/TaskAssigneePicker";
import { CreateTaskModalProps } from "@/types/taskForm.types";
import { TaskStartDateInput } from "./TaskModal/TaskStartDateInput";
import { RepeatControl } from "@/components/tasks/form/RepeatControl";

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
    sections,
    sectionId,
    setSectionId,
    sprints,
    sprintId,
    setSprintId,
    milestones,
    milestoneId,
    setMilestoneId,
    recurrence,
    setRecurrence,
  } = useCreateTaskModal({ projectId, onClose });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 max-w-2xl w-full border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Create Project Task
          </h2>
          <Button aria-label="Header"
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-lg"
          >
            <X size={20} />
          </Button>
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
          <TaskStartDateInput
          value={formData.startDate}
          onChange={(value) => updateField("startDate", value)}
          />

          {/* Due Date */}
          <TaskDueDateInput
            value={formData.dueDate}
            onChange={(value) => updateField("dueDate", value)}
          />

          {/* Section */}
          {sections && sections.length > 0 && (
            <div>
              <label
                htmlFor="task-section"
                className="block text-xs font-medium text-muted-foreground mb-1.5"
              >
                Section
              </label>
              <select
                id="task-section"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">No section</option>
                {sections.flatMap((section) =>
                  section.status === "ACTIVE"
                    ? [
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>,
                      ]
                    : [],
                )}
              </select>
            </div>
          )}

          {/* Sprint */}
          {sprints && sprints.length > 0 && (
            <div>
              <label
                htmlFor="task-sprint"
                className="block text-xs font-medium text-muted-foreground mb-1.5"
              >
                Sprint
              </label>
              <select
                id="task-sprint"
                value={sprintId}
                onChange={(e) => setSprintId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">No sprint</option>
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Milestone */}
          {milestones && milestones.length > 0 && (
            <div>
              <label
                htmlFor="task-milestone"
                className="block text-xs font-medium text-muted-foreground mb-1.5"
              >
                Milestone
              </label>
              <select
                id="task-milestone"
                value={milestoneId}
                onChange={(e) => setMilestoneId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">No milestone</option>
                {milestones.map((milestone) => (
                  <option key={milestone.id} value={milestone.id}>
                    {milestone.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Repeat */}
          <RepeatControl value={recurrence} onChange={setRecurrence} />

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
            <Button
              onClick={onClose}
              disabled={isSubmitting}
              variant="outline"
              className="flex-1 px-4 py-2 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              Create Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}