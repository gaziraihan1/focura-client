import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { 
  useLabels,
  CreateLabelDto,
  Label,
  UpdateLabelDto,
  useCreateLabel,
  useLabelNameExists,
  useUpdateLabel,
  } from "./useLabels";
import { useWorkspaceRole } from "./useWorkspace";

export const useLabelPage = (workspaceId: string) => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [deletingLabel, setDeletingLabel] = useState<Label | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { data: labels = [], isLoading } = useLabels(workspaceId);
  const { canManageWorkspace, isLoading: isRoleLoading } =
    useWorkspaceRole(workspaceId);

  const canManageLabels = canManageWorkspace;

  
  const filteredLabels = labels.filter((label) =>
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  return {
    router,
    searchQuery,
    setSearchQuery,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingLabel,
    setEditingLabel,
    deletingLabel,
    setDeletingLabel,
    activeDropdown,
    setActiveDropdown,
    labels,
    isRoleLoading,
    filteredLabels,
    isLoading,
    canManageLabels
  }
};


export interface LabelFormData {
  name: string;
  color: string;
  description: string;
}

const PRESET_COLORS = [
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Lime", value: "#84CC16" },
  { name: "Green", value: "#22C55E" },
  { name: "Emerald", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Sky", value: "#0EA5E9" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Purple", value: "#A855F7" },
  { name: "Fuchsia", value: "#D946EF" },
  { name: "Pink", value: "#EC4899" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Slate", value: "#64748B" },
];

interface UseLabelFormModalProps {
  initialData?: Label;
  workspaceId: string;
  onClose: () => void;
}

export function useLabelFormModal({
  initialData,
  workspaceId,
  onClose,
}: UseLabelFormModalProps) {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<LabelFormData>({
    name: initialData?.name || "",
    color: initialData?.color || PRESET_COLORS[10].value, // Default to Blue
    description: initialData?.description || "",
  });

  const [errors, setErrors] = useState<Partial<LabelFormData>>({});

  const createMutation = useCreateLabel();
  const updateMutation = useUpdateLabel();
  const checkNameExists = useLabelNameExists(workspaceId);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const validate = (): boolean => {
    const newErrors: Partial<LabelFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Label name is required";
    } else if (formData.name.length > 50) {
      newErrors.name = "Label name must be 50 characters or less";
    } else if (
      checkNameExists(formData.name.trim(), initialData?.id) &&
      formData.name.trim() !== initialData?.name
    ) {
      newErrors.name = "A label with this name already exists";
    }

    if (!formData.color) {
      newErrors.color = "Please select a color";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isEditing) {
        const updateData: UpdateLabelDto = {
          name: formData.name.trim(),
          color: formData.color,
          description: formData.description.trim() || null,
        };

        await updateMutation.mutateAsync({
          id: initialData.id,
          data: updateData,
        });
      } else {
        const createData: CreateLabelDto = {
          name: formData.name.trim(),
          color: formData.color,
          description: formData.description.trim() || undefined,
          workspaceId,
          createdAt: new Date("2024-01-01"),
        };

        await createMutation.mutateAsync(createData);
      }

      onClose();
    } catch (error) {
      console.error("Error saving label:", error);
    }
  };

  const updateField = (field: keyof LabelFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    formData,
    errors,
    isEditing,
    isSubmitting,
    presetColors: PRESET_COLORS,
    handleSubmit,
    updateField,
    setFormData,
    setErrors,
  };
}