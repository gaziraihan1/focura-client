// components/Tasks/CreateTaskModal/TaskIntentPicker.tsx
import { Brain } from "lucide-react";
import { INTENT_OPTIONS } from "@/constants/intent.constants";
import { TaskIntent } from "@/types/taskForm.types";
import { Button } from "@/components/ui/Button";

interface TaskIntentPickerProps {
  value?: TaskIntent;
  onChange: (value: TaskIntent) => void;
}

export function TaskIntentPicker({ value, onChange }: TaskIntentPickerProps) {
  return (
    <div>
      <span className="text-sm font-medium mb-2 block">
        <Brain size={14} className="inline mr-1" />
        Task Intent
      </span>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {INTENT_OPTIONS.map((intent) => {
          const Icon = intent.icon;
          const selected = value === intent.value;

          return (
            <Button
              key={intent.value}
              variant="ghost"
              onClick={() => onChange(intent.value)}
              className={`h-auto p-3 rounded-lg border text-left ${
                selected ? intent.activeClass : "border-border hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={16} />
                <span className="font-medium text-sm">{intent.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {intent.description}
              </p>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
