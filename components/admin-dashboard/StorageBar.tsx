'use client';

import { cn } from '@/lib/utils';

interface Props {
  usedMb:  number;
  maxMb:   number;
  showLabel?: boolean;
}

export function StorageBar({ usedMb, maxMb, showLabel = true }: Props) {
  const pct     = maxMb > 0 ? Math.min(100, Math.round((usedMb / maxMb) * 100)) : 0;
  const isHigh  = pct >= 90;
  const isMed   = pct >= 70;

  return (
    <div className="space-y-1">
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isHigh ? 'bg-destructive' : isMed ? 'bg-amber-500' : 'bg-primary',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className={cn(
          'text-[10px] tabular-nums',
          isHigh ? 'text-destructive' : 'text-muted-foreground',
        )}>
          {usedMb.toLocaleString()} / {maxMb.toLocaleString()} MB ({pct}%)
        </p>
      )}
    </div>
  );
}