import { ArrowLeft } from "lucide-react";

interface NewProjectPageHeaderProps {
  onCancel: () => void;
}

export function NewProjectPageHeader({ onCancel }: NewProjectPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-accent transition"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Project</h1>
          <p className="text-muted-foreground mt-1">
            Projects in this workspace are only visible here
          </p>
        </div>
      </div>
    </div>
  );
}