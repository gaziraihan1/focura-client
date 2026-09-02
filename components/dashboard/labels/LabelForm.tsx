import { Button } from "@/components/ui/Button";
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
export default function LabelForm({ label, workspaceId, onSave, onCancel, isSaving }: LabelFormProps) {
    
  const [name, setName] = useState(label?.name || '');
  const [color, setColor] = useState(label?.color || PRESET_COLORS[0]);
  const [description, setDescription] = useState(label?.description || '');
  const checkNameExists = useLabelNameExists();

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
        <label className="block text-sm font-medium text-foreground mb-2" htmlFor="fld-61">
          Label Name *
        </label>
        <input id="fld-61"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Bug, Feature, Documentation"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          maxLength={50}
          required
        />
      </div>

      {/* Color Picker */}
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">
          Color
        </span>
        <div className="grid grid-cols-8 gap-2">
          {PRESET_COLORS.map((presetColor) => (
            <Button
              key={presetColor}
              type="button"
              aria-label={`Select color ${presetColor}`}
              onClick={() => setColor(presetColor)}
              variant="ghost"
              className={cn(
                'w-8 h-8 rounded-full transition-all',
                color === presetColor && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              )}
              style={{ backgroundColor: presetColor }}
            >
              {color === presetColor && (
                <Check className="w-4 h-4 mx-auto text-white" />
              )}
            </Button>
          ))}
        </div>
        <input aria-label="Label color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="mt-2 w-full h-10 rounded cursor-pointer"
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2" htmlFor="fld-62">
          Description (Optional)
        </label>
        <textarea id="fld-62"
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
        <Button
          type="submit"
          disabled={isSaving}
          className="flex-1 px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          {isSaving ? 'Saving...' : label ? 'Update' : 'Create'}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          variant="secondary"
          className="px-4 py-2 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
