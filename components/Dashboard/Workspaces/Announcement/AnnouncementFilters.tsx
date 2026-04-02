'use client';

import { Globe, Lock, Pin, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnnouncementVisibility } from '@/types/announcement.types';

interface AnnouncementFiltersProps {
  visibility:         AnnouncementVisibility | 'ALL';
  isPinned:           boolean | undefined;
  activeFiltersCount: number;
  onVisibilityChange: (v: AnnouncementVisibility | 'ALL') => void;
  onIsPinnedChange:   (v: boolean | undefined) => void;
  onReset:            () => void;
}

const VISIBILITY_OPTIONS: { value: AnnouncementVisibility | 'ALL'; label: string; icon: typeof Globe }[] = [
  { value: 'ALL',     label: 'All',     icon: Globe },
  { value: 'PUBLIC',  label: 'Public',  icon: Globe },
  { value: 'PRIVATE', label: 'Private', icon: Lock  },
];

export function AnnouncementFilters({
  visibility,
  isPinned,
  activeFiltersCount,
  onVisibilityChange,
  onIsPinnedChange,
  onReset,
}: AnnouncementFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
        {VISIBILITY_OPTIONS.map((opt) => {
          const Icon    = opt.icon;
          const active  = visibility === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onVisibilityChange(opt.value)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                active
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="w-3 h-3" />
              {opt.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onIsPinnedChange(isPinned === true ? undefined : true)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
          'border',
          isPinned === true
            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
            : 'bg-background text-muted-foreground border-border hover:text-foreground',
        )}
      >
        <Pin className="w-3 h-3" />
        Pinned
      </button>

      {activeFiltersCount > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      )}
    </div>
  );
}