import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProfilePageHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

// oxlint-disable-next-line react-doctor/prefer-explicit-variants -- loading-state flags render distinct sub-states
export function ProfilePageHeader({
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
}: ProfilePageHeaderProps) {
  return (
    <div className="flex items-center flex-wrap gap-3 justify-between">
      <div>
        <h1 className="text-xl sm:text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {!isEditing ? (
        <Button
          onClick={onEdit}
          className="hover:opacity-90"
        >
          Edit Profile
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <X size={18} />
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 hover:opacity-90"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}