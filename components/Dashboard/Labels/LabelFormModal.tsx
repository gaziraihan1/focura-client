"use client";

import { motion } from "framer-motion";
import { Label } from "@/hooks/useLabels";
import { useLabelFormModal } from "@/hooks/useLabelPage";
import LabelFormHeader from "./LabelFormModal/LabelFormHeader";
import { LabelNameInput } from "./LabelFormModal/LabelNameInput";
import { LabelColorPicker } from "./LabelFormModal/LabelColorPicker";
import { LabelDescriptionInput } from "./LabelFormModal/LabelDescriptionInput";
import { LabelPreview } from "./LabelFormModal/LabelPreview";
import { LabelFormActions } from "./LabelFormModal/LabelFormActions";

interface LabelFormModalProps {
  title: string;
  initialData?: Label;
  workspaceId: string;
  onClose: () => void;
}

export default function LabelFormModal({
  title,
  initialData,
  workspaceId,
  onClose,
}: LabelFormModalProps) {
  const {
    formData,
    errors,
    isEditing,
    isSubmitting,
    presetColors,
    handleSubmit,
    updateField,
  } = useLabelFormModal({ initialData, workspaceId, onClose });

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card rounded-lg border border-border shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        >
          <LabelFormHeader
            title={title}
            onClose={onClose}
            isSubmitting={isSubmitting}
          />

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-5"
          >
            <LabelNameInput
              value={formData.name}
              error={errors.name}
              isSubmitting={isSubmitting}
              onChange={(value) => updateField("name", value)}
            />

            <LabelColorPicker
              selectedColor={formData.color}
              colors={presetColors}
              error={errors.color}
              isSubmitting={isSubmitting}
              onColorSelect={(color) => updateField("color", color)}
            />

            <LabelDescriptionInput
              value={formData.description}
              isSubmitting={isSubmitting}
              onChange={(value) => updateField("description", value)}
            />

            <LabelPreview name={formData.name} color={formData.color} />
          </form>

          <LabelFormActions
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            onCancel={onClose}
            onSubmit={handleSubmit}
          />
        </motion.div>
      </div>
    </>
  );
}