import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLabels, Label } from '@/hooks/useLabels';
import { LabelBadge } from './LabelBadge';

interface LabelPickerProps {
  workspaceId?: string;
  selectedLabelIds: string[];
  onChange: (labelIds: string[]) => void;
  maxLabels?: number;
}

export function LabelPicker({
  // workspaceId,
  selectedLabelIds,
  onChange,
  maxLabels = 10,
}: LabelPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: allLabels = [], isLoading } = useLabels();

  const selectedLabels = allLabels.filter((label) =>
    selectedLabelIds.includes(label.id)
  );

  const availableLabels = allLabels.filter(
    (label) => !selectedLabelIds.includes(label.id)
  );

  const handleToggle = (labelId: string) => {
    if (selectedLabelIds.includes(labelId)) {
      onChange(selectedLabelIds.filter((id) => id !== labelId));
    } else {
      if (selectedLabelIds.length >= maxLabels) {
        alert(`You can only select up to ${maxLabels} labels`);
        return;
      }
      onChange([...selectedLabelIds, labelId]);
    }
  };

  const handleRemove = (labelId: string) => {
    onChange(selectedLabelIds.filter((id) => id !== labelId));
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-foreground">
        Labels
      </label>

      {/* Selected Labels */}
      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLabels.map((label) => (
            <LabelBadge
              key={label.id}
              label={label}
              onRemove={() => handleRemove(label.id)}
            />
          ))}
        </div>
      )}

      {/* Add Label Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-accent text-foreground rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add label</span>
          {selectedLabels.length > 0 && (
            <span className="text-muted-foreground">
              ({selectedLabels.length}/{maxLabels})
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <div className="absolute top-full left-0 mt-1 w-64 max-h-64 overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-20">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Loading labels...
                </div>
              ) : availableLabels.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  {allLabels.length === 0
                    ? 'No labels available. Create one first.'
                    : 'All labels have been selected.'}
                </div>
              ) : (
                <div className="p-2">
                  {availableLabels.map((label) => (
                    <button
                      key={label.id}
                      type="button"
                      onClick={() => {
                        handleToggle(label.id);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-left"
                    >
                      <div
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {label.name}
                      </span>
                      {label._count && label._count.tasks > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {label._count.tasks}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Helper Text */}
      {selectedLabels.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Add labels to categorize this task
        </p>
      )}
    </div>
  );
}

/**
 * Simple label display without remove button
 */
export function LabelChip({ label, size = 'sm' }: { label: Label; size?: 'sm' | 'md' }) {
  return <LabelBadge label={label} size={size} />;
}