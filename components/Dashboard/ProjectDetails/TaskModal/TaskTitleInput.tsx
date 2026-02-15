// components/Tasks/CreateTaskModal/TaskTitleInput.tsx
import { AlertCircle } from "lucide-react";

interface TaskTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TaskTitleInput({ value, onChange, error }: TaskTitleInputProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border bg-background focus:ring-2 ring-primary outline-none ${
          error ? "border-red-500" : "border-border"
        }`}
        placeholder="What needs to be done?"
        autoFocus
      />
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}