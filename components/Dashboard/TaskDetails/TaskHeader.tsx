import { ArrowLeft, Edit, Trash, Loader2 } from "lucide-react";

interface TaskHeaderProps {
  isEditing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  canEdit?: boolean;     // NEW
  canDelete?: boolean;   // NEW
}

export const TaskHeader = ({
  isEditing,
  onBack,
  onEdit,
  onDelete,
  isDeleting,
  canEdit = true,      // NEW with default
  canDelete = true,    // NEW with default
}: TaskHeaderProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="flex items-center gap-2">
        {/* Only show Edit button if user has permission and not currently editing */}
        {!isEditing && canEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
          >
            <Edit size={16} />
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}

        {/* Only show Delete button if user has permission */}
        {canDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash size={16} />
            )}
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};