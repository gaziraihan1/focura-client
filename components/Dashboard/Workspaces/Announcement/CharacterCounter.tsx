import { cn } from '@/lib/utils';
import { CHARACTER_LIMITS } from '@/constants/announcement.constants';

interface CharacterCounterProps {
  count: number;
}

export function CharacterCounter({ count }: CharacterCounterProps) {
  const getColorClass = () => {
    if (count > CHARACTER_LIMITS.DANGER) return 'text-destructive';
    if (count > CHARACTER_LIMITS.WARNING) return 'text-yellow-500';
    return 'text-muted-foreground/50';
  };

  return (
    <div className="flex justify-end">
      <span className={cn('text-[11px] tabular-nums transition-colors', getColorClass())}>
        {count.toLocaleString()} / {CHARACTER_LIMITS.MAX.toLocaleString()}
      </span>
    </div>
  );
}