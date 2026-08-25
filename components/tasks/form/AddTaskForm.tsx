import { TaskDetailsSection } from "@/components/tasks/form/TaskDetailsSection";
import { TaskIntentSection } from "@/components/tasks/form/TaskIntentSection";
import { TaskStatusPrioritySection } from "@/components/tasks/form/TaskStatusPrioritySection";
import { FocusEnergySection } from "@/components/tasks/form/FocusEnergySection";
import { TaskDatesSection } from "@/components/tasks/form/TaskDatesSection";
import { FormActions } from "@/components/tasks/form/FormActions";
import type { AiTaskSuggestion } from "@/types/ai.types";

interface FormData {
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "IN_REVIEW" | "BLOCKED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  startDate: string;
  dueDate: string;
  estimatedHours: number | undefined;
  focusRequired: boolean;
  focusLevel: number;
  energyType: "LOW" | "MEDIUM" | "HIGH";
  distractionCost: number;
  intent: "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION";
}

interface AddTaskFormProps {
  formData: FormData;
  errors: Record<string, string>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onFieldChange: (field: string, value: unknown) => void;
  /** Workspace for AI rate limiting — omitted for personal tasks. */
  workspaceId?: string | null;
  /** Enables AI task suggestions (autocomplete). */
  onApplyAiSuggestion?: (suggestion: AiTaskSuggestion) => void;
  /** Applies a single suggested field. */
  onApplyAiPartial?: (patch: Partial<AiTaskSuggestion>) => void;
}

export function AddTaskForm({
  formData,
  errors,
  isLoading,
  onSubmit,
  onCancel,
  onFieldChange,
  workspaceId,
  onApplyAiSuggestion,
  onApplyAiPartial,
}: AddTaskFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <TaskDetailsSection
        title={formData.title}
        description={formData.description}
        errors={errors}
        onTitleChange={(title) => onFieldChange("title", title)}
        onDescriptionChange={(description) =>
          onFieldChange("description", description)
        }
        workspaceId={workspaceId}
        onApplyAiSuggestion={onApplyAiSuggestion}
        onApplyAiPartial={onApplyAiPartial}
      />

      <TaskIntentSection
        selectedIntent={formData.intent}
        onIntentChange={(intent) => onFieldChange("intent", intent)}
      />

      <TaskStatusPrioritySection
        status={formData.status}
        priority={formData.priority}
        onStatusChange={(status) => onFieldChange("status", status)}
        onPriorityChange={(priority) => onFieldChange("priority", priority)}
      />

      <FocusEnergySection
        focusRequired={formData.focusRequired}
        focusLevel={formData.focusLevel}
        energyType={formData.energyType}
        distractionCost={formData.distractionCost}
        onFocusRequiredChange={(focusRequired) =>
          onFieldChange("focusRequired", focusRequired)
        }
        onFocusLevelChange={(focusLevel) =>
          onFieldChange("focusLevel", focusLevel)
        }
        onEnergyTypeChange={(energyType) =>
          onFieldChange("energyType", energyType)
        }
        onDistractionCostChange={(distractionCost) =>
          onFieldChange("distractionCost", distractionCost)
        }
      />

      <TaskDatesSection
        startDate={formData.startDate}
        dueDate={formData.dueDate}
        estimatedHours={formData.estimatedHours}
        errors={errors}
        onStartDateChange={(startDate) => onFieldChange("startDate", startDate)}
        onDueDateChange={(dueDate) => onFieldChange("dueDate", dueDate)}
        onEstimatedHoursChange={(estimatedHours) =>
          onFieldChange("estimatedHours", estimatedHours)
        }
      />

      <FormActions isLoading={isLoading} onCancel={onCancel} />
    </form>
  );
}