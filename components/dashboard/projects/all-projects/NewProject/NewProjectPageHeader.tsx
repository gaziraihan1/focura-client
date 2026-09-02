import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NewProjectPageHeaderProps {
  onCancel: () => void;
}

export function NewProjectPageHeader({ onCancel }: NewProjectPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button aria-label="Previous page"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="rounded-lg"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </Button>
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