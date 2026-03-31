// components/Tasks/CreateTaskModal/TaskStartDateInput.tsx

interface TaskStartDateInputProps {
  value?: string;
  onChange: (value: string) => void;
}

export function TaskStartDateInput({ value, onChange }: TaskStartDateInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        Start Date
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
      />
    </div>
  );
}