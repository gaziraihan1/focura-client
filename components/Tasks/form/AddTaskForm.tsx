import { TaskDetailsSection } from "@/components/Tasks/form/TaskDetailsSection";
import { TaskIntentSection } from "@/components/Tasks/form/TaskIntentSection";
import { TaskStatusPrioritySection } from "@/components/Tasks/form/TaskStatusPrioritySection";
import { FocusEnergySection } from "@/components/Tasks/form/FocusEnergySection";
import { TaskDatesSection } from "@/components/Tasks/form/TaskDatesSection";
import { FormActions } from "@/components/Tasks/form/FormActions";

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
}

export function AddTaskForm({
  formData,
  errors,
  isLoading,
  onSubmit,
  onCancel,
  onFieldChange,
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