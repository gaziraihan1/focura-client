// components/ActivityFilters/ActiveFiltersBadge.tsx
import { X } from 'lucide-react';

interface ActiveFiltersBadgeProps {
  label: string;
  value: string;
  onClear: () => void;
}

export function ActiveFiltersBadge({
  label,
  value,
  onClear,
}: ActiveFiltersBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
      {label}: {value}
      <button
        onClick={onClear}
        className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label={`Clear ${label.toLowerCase()} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}