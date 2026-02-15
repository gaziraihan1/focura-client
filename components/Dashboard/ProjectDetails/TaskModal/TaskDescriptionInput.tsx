// components/Tasks/CreateTaskModal/TaskDescriptionInput.tsx

interface TaskDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TaskDescriptionInput({
  value,
  onChange,
}: TaskDescriptionInputProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Description</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary outline-none resize-none"
        placeholder="Optional context for this task"
      />
    </div>
  );
}