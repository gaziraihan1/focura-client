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
    <div className="flex-1 min-w-[200px]">
      <select
        value={value || 'all'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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