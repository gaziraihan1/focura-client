"use client"
import {motion} from 'framer-motion';
import { CreateLabelDto, Label, UpdateLabelDto, useCreateLabel, useLabelNameExists, useUpdateLabel } from "@/hooks/useLabels";
import { useState } from "react";
import { Loader2, X } from 'lucide-react';
import { LabelFormData } from './LabelManagementMain';

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
  const isEditing = !!initialData;
  const PRESET_COLORS = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Lime', value: '#84CC16' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Sky', value: '#0EA5E9' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Fuchsia', value: '#D946EF' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Slate', value: '#64748B' },
];

  
  const [formData, setFormData] = useState<LabelFormData>({
    name: initialData?.name || '',
    color: initialData?.color || PRESET_COLORS[10].value, // Default to Blue
    description: initialData?.description || '',
  });
  const [errors, setErrors] = useState<Partial<LabelFormData>>({});

  const createMutation = useCreateLabel();
  const updateMutation = useUpdateLabel();
  const checkNameExists = useLabelNameExists(workspaceId);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const validate = (): boolean => {
    const newErrors: Partial<LabelFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Label name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Label name must be 50 characters or less';
    } else if (
      checkNameExists(formData.name.trim(), initialData?.id) &&
      formData.name.trim() !== initialData?.name
    ) {
      newErrors.name = 'A label with this name already exists';
    }

    if (!formData.color) {
      newErrors.color = 'Please select a color';
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
          createdAt: new Date('2024-01-01')
        };
        
        await createMutation.mutateAsync(createData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving label:', error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card rounded-lg border border-border shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g., Bug, Feature, High Priority"
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-foreground placeholder:text-muted-foreground ${
                  errors.name ? 'border-destructive' : 'border-input'
                }`}
                maxLength={50}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Color <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-9 gap-2">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, color: preset.value });
                      if (errors.color) setErrors({ ...errors, color: undefined });
                    }}
                    className={`w-full aspect-square rounded-lg transition-all hover:scale-110 ${
                      formData.color === preset.value
                        ? 'ring-2 ring-ring ring-offset-2 ring-offset-background scale-110'
                        : 'hover:ring-2 hover:ring-ring/50'
                    }`}
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
              {errors.color && (
                <p className="mt-1 text-sm text-destructive">{errors.color}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description <span className="text-muted-foreground text-xs">(Optional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Add a description for this label..."
                rows={3}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-foreground placeholder:text-muted-foreground resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Preview */}
            <div className="pt-4 border-t border-border">
              <label className="block text-sm font-medium text-foreground mb-2">
                Preview
              </label>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-muted">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: formData.color }}
                />
                <span className="text-foreground">
                  {formData.name.trim() || 'Label name'}
                </span>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Label'}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
