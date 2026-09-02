import { Priority } from "@/types/taskForm.types";
import { Button } from "@/components/ui/Button";

interface TaskPriorityPickerProps {
  value: Priority;
  onChange: (value: Priority) => void;
}

const PRIORITY_OPTIONS: Priority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"];

const PRIORITY_COLORS: Record<Priority, string> = {
  URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
  HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  LOW: "bg-green-500/10 text-green-500 border-green-500/20",
};

export function TaskPriorityPicker({
  value,
  onChange,
}: TaskPriorityPickerProps) {
  return (
    <div>
      <span className="text-sm font-medium mb-2 block">Priority</span>
      <div className="grid grid-cols-4 gap-2">
        {PRIORITY_OPTIONS.map((priority) => (
          <Button
            key={priority}
            variant="ghost"
            onClick={() => onChange(priority)}
            className={`h-auto px-3 py-2 rounded-lg border text-sm font-medium ${
              value === priority
                ? PRIORITY_COLORS[priority]
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {priority}
          </Button>
        ))}
      </div>
    </div>
  );
}