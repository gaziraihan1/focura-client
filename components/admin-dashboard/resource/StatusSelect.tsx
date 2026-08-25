import type { ResourceStatus } from "@/types/resource.types";

const STATUS_OPTIONS: { value: ResourceStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLIC", label: "Public" },
  { value: "ARCHIVE", label: "Archive" },
];

interface StatusSelectProps {
  id: string;
  value: ResourceStatus;
  onChange: (value: ResourceStatus) => void;
  disabled?: boolean;
}

export function StatusSelect({ id, value, onChange, disabled }: StatusSelectProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        Status
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as ResourceStatus)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}