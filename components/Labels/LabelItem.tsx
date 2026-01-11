import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Label } from '@/hooks/useLabels';

interface LabelItemProps {
  label: Label;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function LabelItem({ 
  label, 
  onEdit, 
  onDelete, 
  isDeleting = false 
}: LabelItemProps) {
  // Show actions only if callbacks are provided (user has permission)
  const showActions = onEdit || onDelete;

  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-accent transition-colors group">
      {/* Color Indicator */}
      <div
        className="w-4 h-4 rounded-full shrink-0"
        style={{ backgroundColor: label.color }}
      />

      {/* Label Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{label.name}</span>
          {label._count && label._count.tasks > 0 && (
            <span className="text-xs text-muted-foreground">
              ({label._count.tasks} {label._count.tasks === 1 ? 'task' : 'tasks'})
            </span>
          )}
        </div>
        {label.description && (
          <p className="text-sm text-muted-foreground truncate">
            {label.description}
          </p>
        )}
      </div>

      {/* Actions - Only show if user has permission */}
      {showActions && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 hover:bg-background rounded transition-colors"
              title="Edit label"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-2 hover:bg-background rounded transition-colors disabled:opacity-50"
              title="Delete label"
            >
              <Trash2 className="w-4 h-4 text-destructive hover:text-destructive/80" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}