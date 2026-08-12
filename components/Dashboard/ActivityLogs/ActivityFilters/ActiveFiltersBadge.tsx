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
    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-medium text-foreground">
      {label}: {value}
      <button
        onClick={onClear}
        className="ml-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        aria-label={`Clear ${label.toLowerCase()} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
