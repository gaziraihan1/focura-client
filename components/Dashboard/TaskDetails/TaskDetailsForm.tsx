// components/TaskDetails/TaskDetailsForm.tsx
import { Loader2 } from "lucide-react";

interface EditData {
  title: string;
  description: string;
  priority: string;
  status: string;
  estimatedHours: string;
}

interface TaskDetailsFormProps {
  editData: EditData;
  isUpdating: boolean;
  onEditDataChange: (data: EditData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const TaskDetailsForm = ({
  editData,
  isUpdating,
  onEditDataChange,
  onSave,
  onCancel,
}: TaskDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={editData.title}
        onChange={(e) =>
          onEditDataChange({ ...editData, title: e.target.value })
        }
        className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-xl font-bold focus:ring-2 ring-primary outline-none"
      />

      <textarea
        value={editData.description}
        onChange={(e) =>
          onEditDataChange({ ...editData, description: e.target.value })
        }
        rows={6}
        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground resize-none focus:ring-2 ring-primary outline-none"
        placeholder="Add description..."
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Estimated Hours
        </label>
        <input
          type="number"
          value={editData.estimatedHours}
          onChange={(e) =>
            onEditDataChange({ ...editData, estimatedHours: e.target.value })
          }
          min="0"
          step="0.5"
          placeholder="e.g., 8"
          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSave}
          disabled={isUpdating}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
        >
          {isUpdating && <Loader2 size={16} className="animate-spin" />}
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};