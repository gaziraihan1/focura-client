// components/Tasks/CreateTaskModal/TaskDueDateInput.tsx

interface TaskDueDateInputProps {
  value?: string;
  onChange: (value: string) => void;
}

export function TaskDueDateInput({ value, onChange }: TaskDueDateInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1" htmlFor="fld-28">
        Due Date
      </label>
      <input id="fld-28"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
      />
    </div>
  );
}