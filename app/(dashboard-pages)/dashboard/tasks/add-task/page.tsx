"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useCreateTask, CreateTaskDto } from "@/hooks/useTask";
import { TaskFormHeader } from "@/components/Tasks/form/TaskFormHeader";
import { TaskDetailsSection } from "@/components/Tasks/form/TaskDetailsSection";
import { TaskIntentSection } from "@/components/Tasks/form/TaskIntentSection";
import { TaskStatusPrioritySection } from "@/components/Tasks/form/TaskStatusPrioritySection";
import { FocusEnergySection } from "@/components/Tasks/form/FocusEnergySection";
import { TaskDatesSection } from "@/components/Tasks/form/TaskDatesSection";
import { FormActions } from "@/components/Tasks/form/FormActions";

export default function AddTaskPage() {
  const router = useRouter();
  const createTaskMutation = useCreateTask();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO" as CreateTaskDto["status"],
    priority: "MEDIUM" as CreateTaskDto["priority"],
    startDate: "",
    dueDate: "",
    estimatedHours: undefined as number | undefined,

    // Focura fields
    focusRequired: false,
    focusLevel: 3,
    energyType: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    distractionCost: 1,
    intent: "EXECUTION" as "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Task title is required";
    if (formData.title.length > 200)
      newErrors.title = "Title must be under 200 characters";

    if (
      formData.startDate &&
      formData.dueDate &&
      new Date(formData.startDate) > new Date(formData.dueDate)
    ) {
      newErrors.dueDate = "Due date must be after start date";
    }

    if (
      formData.estimatedHours !== undefined &&
      (isNaN(formData.estimatedHours) || formData.estimatedHours < 0)
    ) {
      newErrors.estimatedHours = "Invalid estimated hours";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return toast.error("Please fix the errors");

    try {
      await createTaskMutation.mutateAsync({
        ...formData,
        projectId: null,
        workspaceId: null,
        assigneeIds: [],
        labelIds: [],
      });

      toast.success("Task created successfully");
      router.push("/dashboard/tasks");
    } catch {
      toast.error("Failed to create task");
    }
  };

  const handleCancel = () => router.push("/dashboard/tasks");

  const isLoading = createTaskMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6">
      <TaskFormHeader onCancel={handleCancel} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <TaskDetailsSection
          title={formData.title}
          description={formData.description}
          errors={errors}
          onTitleChange={(title) => setFormData((p) => ({ ...p, title }))}
          onDescriptionChange={(description) =>
            setFormData((p) => ({ ...p, description }))
          }
        />

        <TaskIntentSection
          selectedIntent={formData.intent}
          onIntentChange={(intent) => setFormData((p) => ({ ...p, intent }))}
        />

        <TaskStatusPrioritySection
          status={formData.status}
          priority={formData.priority}
          onStatusChange={(status) => setFormData((p) => ({ ...p, status }))}
          onPriorityChange={(priority) =>
            setFormData((p) => ({ ...p, priority }))
          }
        />

        <FocusEnergySection
          focusRequired={formData.focusRequired}
          focusLevel={formData.focusLevel}
          energyType={formData.energyType}
          distractionCost={formData.distractionCost}
          onFocusRequiredChange={(focusRequired) =>
            setFormData((p) => ({ ...p, focusRequired }))
          }
          onFocusLevelChange={(focusLevel) =>
            setFormData((p) => ({ ...p, focusLevel }))
          }
          onEnergyTypeChange={(energyType) =>
            setFormData((p) => ({ ...p, energyType }))
          }
          onDistractionCostChange={(distractionCost) =>
            setFormData((p) => ({ ...p, distractionCost }))
          }
        />

        <TaskDatesSection
          startDate={formData.startDate}
          dueDate={formData.dueDate}
          estimatedHours={formData.estimatedHours}
          errors={errors}
          onStartDateChange={(startDate) =>
            setFormData((p) => ({ ...p, startDate }))
          }
          onDueDateChange={(dueDate) => setFormData((p) => ({ ...p, dueDate }))}
          onEstimatedHoursChange={(estimatedHours) =>
            setFormData((p) => ({ ...p, estimatedHours }))
          }
        />

        <FormActions
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
}