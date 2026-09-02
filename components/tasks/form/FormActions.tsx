import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

export function FormActions({ isLoading, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        leftIcon={<Save size={16} />}
      >
        Create Task
      </Button>
    </div>
  );
}