import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCreateTask, CreateTaskDto } from "@/hooks/useTask";

interface FormData {
  title: string;
  description: string;
  status: CreateTaskDto["status"];
  priority: CreateTaskDto["priority"];
  startDate: string;
  dueDate: string;
  estimatedHours: number | undefined;
  focusRequired: boolean;
  focusLevel: number;
  energyType: "LOW" | "MEDIUM" | "HIGH";
  distractionCost: number;
  intent: "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION";
}

const initialFormData: FormData = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  startDate: "",
  dueDate: "",
  estimatedHours: undefined,
  focusRequired: false,
  focusLevel: 3,
  energyType: "MEDIUM",
  distractionCost: 1,
  intent: "EXECUTION",
};

export function useAddTaskPage() {
  const router = useRouter();
  const createTaskMutation = useCreateTask();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    if (formData.title.length > 200) {
      newErrors.title = "Title must be under 200 characters";
    }

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
    
    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }

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

  const handleCancel = () => {
    router.push("/dashboard/tasks");
  };

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateMultipleFields = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return {
    formData,
    errors,
    isLoading: createTaskMutation.isPending,
    handleSubmit,
    handleCancel,
    updateFormData,
    updateMultipleFields,
  };
}