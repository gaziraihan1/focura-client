import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateWorkspace } from "@/hooks/useWorkspace";

const PREDEFINED_COLORS = [
  "#667eea",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

interface FormData {
  name: string;
  description: string;
  color: string;
  isPublic: boolean;
  plan: "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";
}

export function useCreateWorkspacePage() {
  const router = useRouter();
  const createWorkspace = useCreateWorkspace();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    color: PREDEFINED_COLORS[0],
    isPublic: false,
    plan: "FREE",
  });

  const [selectedType, setSelectedType] = useState("team");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Workspace name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createWorkspace.mutate(formData);
  };

  const handleCancel = () => {
    router.push("/dashboard/workspaces");
  };

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field changes
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return {
    formData,
    selectedType,
    setSelectedType,
    errors,
    isSubmitting: createWorkspace.isPending,
    predefinedColors: PREDEFINED_COLORS,
    handleSubmit,
    handleCancel,
    updateField,
  };
}