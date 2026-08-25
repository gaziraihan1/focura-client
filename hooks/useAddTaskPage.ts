import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCreateTask, CreateTaskDto } from "@/hooks/useTask";
import { api } from "@/lib/axios";
import type { AiTaskSuggestion } from "@/types/ai.types";

interface FormData {
  title: string;
  description: string;
  status: CreateTaskDto["status"];
  priority: CreateTaskDto["priority"];
  startDate: string;
  dueDate: string;
  estimatedHours: number | undefined;
  projectId?: string
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
  // Subtasks accepted from the AI suggestion bar — created after the task exists.
  const [pendingSubtasks, setPendingSubtasks] = useState<string[]>([]);

  /** Apply an AI suggestion across the form fields + remember suggested subtasks. */
  const applyAiSuggestion = (suggestion: AiTaskSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      description: suggestion.description || prev.description,
      priority: suggestion.priority ?? prev.priority,
      energyType: suggestion.energyType ?? prev.energyType,
      intent: suggestion.intent ?? prev.intent,
      estimatedHours: suggestion.estimatedHours ?? prev.estimatedHours,
      dueDate: suggestion.dueDate ?? prev.dueDate,
    }));
    if (suggestion.subtasks?.length) {
      setPendingSubtasks(suggestion.subtasks.map((subtask) => subtask.title));
    }
  };

  /** Apply a single AI-suggested field (chip click). */
  const applyAiPartial = (patch: Partial<AiTaskSuggestion>) => {
    setFormData((prev) => {
      const next = { ...prev };
      if (patch.priority) next.priority = patch.priority;
      if (patch.energyType) next.energyType = patch.energyType;
      if (patch.intent) next.intent = patch.intent;
      if (patch.estimatedHours != null) next.estimatedHours = patch.estimatedHours;
      if (patch.dueDate) next.dueDate = patch.dueDate;
      if (patch.description) next.description = patch.description;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const created = await createTaskMutation.mutateAsync({
        ...formData,
        projectId: undefined,
        workspaceId: null,
        assigneeIds: [],
        labelIds: [],
      });

      // Create any AI-suggested subtasks once the parent task exists.
      if (created?.id && pendingSubtasks.length > 0) {
        const titles = pendingSubtasks;
        setPendingSubtasks([]);
        await Promise.allSettled(
          titles.map((title) =>
            api.post(`/api/v1/tasks/${created.id}/subtasks`, { title }),
          ),
        );
      }

      toast.success("Task created successfully");
      router.push("/dashboard/tasks");
    } catch (err) {
      // Structural shape of a rejected api.* call (AxiosError-like) without
      // importing raw axios types.
      const error = err as {
        response?: {
          data?: {
            message?: string;
            errors?: { path: string[]; message: string }[];
          };
        };
      };

      const fieldErrors = error.response?.data?.errors;

      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        const mapped: Record<string, string> = {};

        fieldErrors.forEach((issue) => {
          if (issue.path.length > 0) {
            mapped[issue.path[0]] = issue.message;
          }
        });

        setErrors(mapped);
      } else {
        toast.error(error.response?.data?.message ?? "Failed to create task");
      }
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/tasks");
  };

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if(errors[field] ) {
      setErrors((prev) => {
        const next = {...prev};
        delete next[field];
        return next;
      })
    }
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
    applyAiSuggestion,
    applyAiPartial,
    pendingSubtasks,
  };
}