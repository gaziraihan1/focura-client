// src/components/announcements/AnnouncementForm.tsx
'use client';

import { Pin, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnnouncementContentEditor } from './AnnouncementContentEditor';
import type { AnnouncementVisibility } from '@/types/announcement.types';
import Image from 'next/image';

interface WorkspaceMember {
  userId: string;
  user: { id: string; name: string; image: string | null };
}

interface FormState {
  title:      string;
  content:    string;
  visibility: AnnouncementVisibility;
  isPinned:   boolean;
  targetIds:  string[];
}

interface AnnouncementFormProps {
  formState:          FormState;
  members:            WorkspaceMember[];
  onTitleChange:      (v: string) => void;
  onContentChange:    (v: string) => void;
  onVisibilityChange: (v: AnnouncementVisibility) => void;
  onIsPinnedChange:   (v: boolean) => void;
  onTargetToggle:     (uid: string) => void;
  disabled?:          boolean;
}

const VISIBILITY_OPTIONS: {
  value: AnnouncementVisibility;
  label: string;
  icon:  typeof Globe;
  desc:  string;
}[] = [
  { value: 'PUBLIC',  label: 'Everyone',        icon: Globe, desc: 'All workspace members' },
  { value: 'PRIVATE', label: 'Specific people', icon: Lock,  desc: 'Choose recipients below' },
];

export function AnnouncementForm({
  formState,
  members,
  onTitleChange,
  onContentChange,
  onVisibilityChange,
  onIsPinnedChange,
  onTargetToggle,
  disabled,
}: AnnouncementFormProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Title
        </label>
        <input
          type="text"
          value={formState.title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={disabled}
          placeholder="Announcement title…"
          maxLength={200}
          className={cn(
            'w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5',
            'text-sm text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
            'transition-all disabled:opacity-50',
          )}
        />
      </div>

      {/* Content — rich editor */}
      <AnnouncementContentEditor
        value={formState.content}
        onChange={onContentChange}
        disabled={disabled}
      />

      {/* Visibility */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Audience
        </label>
        <div className="grid grid-cols-2 gap-2">
          {VISIBILITY_OPTIONS.map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              type="button"
              disabled={disabled}
              onClick={() => onVisibilityChange(value)}
              className={cn(
                'flex flex-col items-start gap-1 px-3.5 py-3 rounded-xl border text-left transition-all',
                formState.visibility === value
                  ? 'border-primary/60 bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border hover:border-border/80 hover:bg-muted/50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn(
                  'w-3.5 h-3.5',
                  formState.visibility === value ? 'text-primary' : 'text-muted-foreground',
                )} />
                <span className={cn(
                  'text-sm font-medium',
                  formState.visibility === value ? 'text-primary' : 'text-foreground',
                )}>
                  {label}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target member picker (PRIVATE only) */}
      {formState.visibility === 'PRIVATE' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Recipients
            </label>
            {formState.targetIds.length > 0 && (
              <span className="text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {formState.targetIds.length} selected
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto rounded-xl border border-border p-1.5">
            {members.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3">No members found</p>
            ) : (
              members.map(({ userId, user }) => {
                const selected = formState.targetIds.includes(userId);
                return (
                  <button
                    key={userId}
                    type="button"
                    disabled={disabled}
                    onClick={() => onTargetToggle(userId)}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors',
                      selected
                        ? 'bg-primary/8 text-foreground'
                        : 'hover:bg-muted text-foreground/80',
                      'disabled:opacity-50',
                    )}
                  >
                    {/* Avatar */}
                    <span className="relative shrink-0">
                      {user.image ? (
                        <Image
                        width={24}
                        height={24}
                          src={user.image}
                          alt={user.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      {selected && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                          </svg>
                        </span>
                      )}
                    </span>
                    <span className="text-sm">{user.name}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Pin toggle */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onIsPinnedChange(!formState.isPinned)}
        className={cn(
          'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all',
          formState.isPinned
            ? 'border-amber-500/50 bg-amber-500/8 text-amber-600 dark:text-amber-400'
            : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        <Pin className={cn('w-3.5 h-3.5', formState.isPinned && 'fill-current')} />
        <span className="text-sm font-medium">
          {formState.isPinned ? 'Pinned to top' : 'Pin this announcement'}
        </span>
      </button>
    </div>
  );
}