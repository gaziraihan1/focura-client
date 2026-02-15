'use client';

import { useState, useCallback } from "react";
import { useCreateTask } from "@/hooks/useTask";
import { CreateTaskFormData } from "@/types/taskForm.types";
import { INITIAL_FORM_DATA } from "@/constant/taskForm";

interface UseCreateTaskFormProps {
  projectId: string;
  onSuccess: () => void;
}

export function useCreateTaskForm({ projectId, onSuccess }: UseCreateTaskFormProps) {
  const createTask = useCreateTask();
  const [formData, setFormData] = useState<CreateTaskFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(<K extends keyof CreateTaskFormData>(
    field: K,
    value: CreateTaskFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

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
        onSuccess,
      }
    );
  }, [validate, createTask, formData, projectId, onSuccess]);

  return {
    formData,
    errors,
    isSubmitting: createTask.isPending,
    updateField,
    toggleAssignee,
    handleSubmit,
  };
}