import { Label, useLabelNameExists } from "@/hooks/useLabels";
import { cn } from "@/lib/utils";
// import { Label } from "@/types";
import { Check } from "lucide-react";
import { useState } from "react";

interface LabelFormProps {
  label?: Label;
  workspaceId?: string;
  onSave: (data: { name: string; color: string; description?: string; workspaceId?: string; createdAt: Date }) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function LabelForm({ label, workspaceId, onSave, onCancel, isSaving }: LabelFormProps) {
    const PRESET_COLORS = [
      '#ef4444', // red
      '#f97316', // orange
      '#f59e0b', // amber
      '#eab308', // yellow
      '#84cc16', // lime
      '#22c55e', // green
      '#10b981', // emerald
      '#14b8a6', // teal
      '#06b6d4', // cyan
      '#0ea5e9', // sky
      '#3b82f6', // blue
      '#6366f1', // indigo
      '#8b5cf6', // violet
      '#a855f7', // purple
      '#d946ef', // fuchsia
      '#ec4899', // pink
    ];
    
  const [name, setName] = useState(label?.name || '');
  const [color, setColor] = useState(label?.color || PRESET_COLORS[0]);
  const [description, setDescription] = useState(label?.description || '');
  const checkNameExists = useLabelNameExists(workspaceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Label name is required');
      return;
    }

    if (checkNameExists(name.trim(), label?.id)) {
      alert('A label with this name already exists');
      return;
    }

    onSave({
      name: name.trim(),
      color,
      description: description.trim() || undefined,
      createdAt: new Date('2024-01-01'),
      workspaceId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-muted p-4 rounded-lg space-y-4 mb-4">
      {/* Name Input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Label Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Bug, Feature, Documentation"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          maxLength={50}
          required
          autoFocus
        />
      </div>

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Color
        </label>
        <div className="grid grid-cols-8 gap-2">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              onClick={() => setColor(presetColor)}
              className={cn(
                'w-8 h-8 rounded-full transition-all',
                color === presetColor && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              )}
              style={{ backgroundColor: presetColor }}
            >
              {color === presetColor && (
                <Check className="w-4 h-4 mx-auto text-white" />
              )}
            </button>
          ))}
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="mt-2 w-full h-10 rounded cursor-pointer"
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this label for?"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          rows={2}
          maxLength={200}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Saving...' : label ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
