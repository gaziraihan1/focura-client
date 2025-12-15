// components/TaskDetails/TaskHeader.tsx
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react";

interface TaskHeaderProps {
  isEditing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const TaskHeader = ({
  isEditing,
  onBack,
  onEdit,
  onDelete,
  isDeleting,
}: TaskHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="flex items-center gap-2">
        {!isEditing && (
          <>
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-accent transition"
            >
              <Edit size={18} className="text-foreground" />
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              {isDeleting ? (
                <Loader2 size={18} className="animate-spin text-red-500" />
              ) : (
                <Trash2 size={18} className="text-red-500" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};