// components/ActivityFilters/DatePresetSelect.tsx
import { DatePreset, DatePresetOption } from '@/types/activityFilter.types';

interface DatePresetSelectProps {
  options: DatePresetOption[];
  onChange: (value: DatePreset | '') => void;
}

export function DatePresetSelect({ options, onChange }: DatePresetSelectProps) {
  return (
    <div className="flex-1 min-w-[200px]">
      <select
        onChange={(e) => onChange(e.target.value as DatePreset | '')}
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="">Filter by date</option>
        {options.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
}