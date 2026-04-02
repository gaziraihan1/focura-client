'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { PreviewContent } from './PreviewContent';
import { EditorToolbar } from './EditorToolbar';
import { CharacterCounter } from './CharacterCounter';
import { useAnnouncementEditor } from '@/hooks/useAnnouncementPage';
import type { AnnouncementContentEditorProps } from '@/types/announcement.types';

export function AnnouncementContentEditor({
  value,
  onChange,
  disabled,
}: AnnouncementContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { preview, togglePreview, applyFormat } = useAnnouncementEditor(
    value,
    onChange,
    textareaRef
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Content
        </label>
        <button
          type="button"
          onClick={togglePreview}
          className={cn(
            'text-xs px-2.5 py-1 rounded-md transition-colors',
            preview
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      <EditorToolbar disabled={disabled || preview} onApplyFormat={applyFormat} />

      <div
        className={cn(
          'rounded-xl border border-border overflow-hidden transition-all',
          !preview &&
            'focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20'
        )}
      >
        {preview ? (
          <div className="min-h-30 px-3.5 py-3 bg-muted/20">
            <PreviewContent raw={value} />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Write your announcement…\n\nTip: **bold**, //italic//, $$mono$$, {https://url.com|link}, > new line"
            rows={6}
            className={cn(
              'w-full resize-none bg-transparent px-3.5 py-3',
              'text-sm text-foreground placeholder:text-muted-foreground/50',
              'focus:outline-none font-mono leading-relaxed',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />
        )}
      </div>

      <CharacterCounter count={value.length} />
    </div>
  );
}