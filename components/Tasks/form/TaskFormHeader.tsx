import { ArrowLeft, X } from "lucide-react";

interface TaskFormHeaderProps {
  onCancel: () => void;
}

export function TaskFormHeader({ onCancel }: TaskFormHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-accent"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl lg:text-3xl font-bold">Create Personal Task</h1>
          <p className="text-muted-foreground">
            Capture tasks with focus and energy awareness
          </p>
        </div>
      </div>
      <button
        onClick={onCancel}
        className="p-2 rounded-lg hover:bg-accent"
      >
        <X size={22} />
      </button>
    </div>
  );
}