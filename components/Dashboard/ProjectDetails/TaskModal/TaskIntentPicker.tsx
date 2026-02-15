// components/Tasks/CreateTaskModal/TaskIntentPicker.tsx
import { Brain } from "lucide-react";
import { INTENT_OPTIONS } from "@/constant/intent.constant";
import { TaskIntent } from "@/types/taskForm.types";

interface TaskIntentPickerProps {
  value?: TaskIntent;
  onChange: (value: TaskIntent) => void;
}

export function TaskIntentPicker({ value, onChange }: TaskIntentPickerProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">
        <Brain size={14} className="inline mr-1" />
        Task Intent
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {INTENT_OPTIONS.map((intent) => {
          const Icon = intent.icon;
          const selected = value === intent.value;

          return (
            <button
              key={intent.value}
              type="button"
              onClick={() => onChange(intent.value)}
              className={`p-3 rounded-lg border text-left transition ${
                selected
                  ? intent.activeClass
                  : "border-border hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={16} />
                <span className="font-medium text-sm">{intent.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {intent.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}