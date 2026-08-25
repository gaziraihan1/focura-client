// components/ActivityFilters/DatePresetSelect.tsx
import { DatePreset, DatePresetOption } from '@/types/activityFilter.types';

interface DatePresetSelectProps {
  options: DatePresetOption[];
  onChange: (value: DatePreset | '') => void;
}

export function DatePresetSelect({ options, onChange }: DatePresetSelectProps) {
  return (
    <div className="flex-1 min-w-50">
      <select aria-label="Select an option"
        onChange={(e) => onChange(e.target.value as DatePreset | '')}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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
