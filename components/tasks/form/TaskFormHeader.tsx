import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TaskFormHeaderProps {
  onCancel: () => void;
}

export function TaskFormHeader({ onCancel }: TaskFormHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Previous page">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-xl lg:text-3xl font-bold">Create Personal Task</h1>
          <p className="text-muted-foreground">
            Capture tasks with focus and energy awareness
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Close">
        <X size={22} />
      </Button>
    </div>
  );
}