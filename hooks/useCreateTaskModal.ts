// hooks/useCreateTaskModal.ts
import { useState, useCallback } from "react";
import { useCreateTask } from "@/hooks/useTask";
import { CreateTaskFormData } from "@/types/taskForm.types";

interface UseCreateTaskModalProps {
  projectId: string;
  onClose: () => void;
}

export function useCreateTaskModal({
  projectId,
  onClose,
}: UseCreateTaskModalProps) {
  const createTask = useCreateTask();

  const [formData, setFormData] = useState<CreateTaskFormData>({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
    estimatedHours: undefined,
    assigneeIds: [],
    labelIds: [],
    intent: "EXECUTION",
    energyType: "MEDIUM",
    focusRequired: false,
    focusLevel: 3,
    distractionCost: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(
    <K extends keyof CreateTaskFormData>(
      field: K,
      value: CreateTaskFormData[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when field is updated
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const toggleAssignee = useCallback((userId: string) => {
    setFormData((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(userId)
        ? prev.assigneeIds.filter((id) => id !== userId)
        : [...prev.assigneeIds, userId],
    }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.title]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    createTask.mutate(
      {
        ...formData,
        projectId,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  }, [validate, createTask, formData, projectId, onClose]);

  return {
    formData,
    errors,
    isSubmitting: createTask.isPending,
    updateField,
    toggleAssignee,
    handleSubmit,
  };
}