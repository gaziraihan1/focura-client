// components/ActivityFilters/FilterSelect.tsx
import { SelectOption } from '@/types/activityFilter.types';

interface FilterSelectProps<T> {
  value: T | 'all' | undefined;
  options: SelectOption<T>[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FilterSelect<T extends string>({
  value,
  options,
  onChange,
  placeholder,
}: FilterSelectProps<T>) {
  return (
    <div className="flex-1 min-w-50">
      <select aria-label="Select an option"
        value={value || 'all'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
