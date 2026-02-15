// components/Tasks/CreateTaskModal/TaskEstimatedHoursInput.tsx
import { Clock } from "lucide-react";

interface TaskEstimatedHoursInputProps {
  value?: number | null;
  onChange: (value: number | undefined) => void;
}

export function TaskEstimatedHoursInput({
  value,
  onChange,
}: TaskEstimatedHoursInputProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">
        <Clock size={14} className="inline mr-1" />
        Estimated Hours
      </label>
      <input
        type="number"
        min={0}
        step={0.5}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : undefined)
        }
        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary outline-none"
        placeholder="e.g. 2.5"
      />
    </div>
  );
}