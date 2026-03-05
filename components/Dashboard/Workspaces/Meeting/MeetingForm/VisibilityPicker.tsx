import { Globe, Lock } from 'lucide-react';
import type { MeetingVisibility } from '@/types/meeting.types';

interface Props {
  value: MeetingVisibility;
  onChange: (v: MeetingVisibility) => void;
}

const OPTIONS: { value: MeetingVisibility; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'PUBLIC',
    label: 'Public',
    description: 'All workspace members can see this',
    icon: <Globe size={14} />,
  },
  {
    value: 'PRIVATE',
    label: 'Private',
    description: 'Only invited attendees can see this',
    icon: <Lock size={14} />,
  },
];

export function VisibilityPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-all ${
            value === opt.value
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-border bg-card hover:border-ring/50'
          }`}
        >
          <span className="text-sm font-medium text-foreground flex items-center gap-2">
            {opt.icon}
            {opt.label}
          </span>
          <span className="text-xs text-muted-foreground">{opt.description}</span>
        </button>
      ))}
    </div>
  );
}