// components/MentionTextarea/MentionTextarea.tsx
'use client';

import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MentionDropdown } from './MentionDropdown';
import { useCommentPage } from '@/hooks/useCommentPage';
import { stripMentionSyntax } from '@/utils/comments.utils';
import type {
  MentionTextareaProps,
  MentionTextareaHandle,
} from '@/types/comment.types';

const MentionTextarea = forwardRef<MentionTextareaHandle, MentionTextareaProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      placeholder,
      mentionableUsers = [],
      disabled,
      minRows = 2,
      className,
      autoFocus,
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
      mentionQuery,
      filteredUsers,
      activeIndex,
      dropdownPos,
      handleChange,
      insertMention,
      handleKeyDown,
    } = useCommentPage(value, onChange, mentionableUsers, textareaRef);

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      insertText: (text: string) => {
        const el = textareaRef.current;
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newVal = value.slice(0, start) + text + value.slice(end);
        onChange(newVal);
        setTimeout(() => {
          el.selectionStart = el.selectionEnd = start + text.length;
        }, 0);
      },
    }));

    // Auto-resize textarea
    useEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    const showDropdown = mentionQuery !== null && filteredUsers.length > 0;

    return (
      <div className={cn('relative', className)}>
        <textarea
          ref={textareaRef}
          value={stripMentionSyntax(value)}
          onChange={handleChange}
          onKeyDown={(e) => handleKeyDown(e, onSubmit)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          rows={minRows}
          className={cn(
            'w-full resize-none bg-background/60 border border-border rounded-xl',
            'px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring/60',
            'transition-all duration-150 overflow-hidden',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          style={{ minHeight: `${minRows * 1.5 + 1.5}rem` }}
        />

        {/* Mention Dropdown */}
        <AnimatePresence>
          {showDropdown && dropdownPos && (
            <MentionDropdown
              users={filteredUsers}
              activeIndex={activeIndex}
              position={dropdownPos}
              onSelect={insertMention}
            />
          )}
        </AnimatePresence>

        {/* Hint */}
        <p className="mt-1.5 text-[10px] text-muted-foreground/50 select-none">
          Type <span className="font-semibold text-muted-foreground/70">@</span> to
          mention ·{' '}
          <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">⌘ Enter</kbd> to
          send
        </p>
      </div>
    );
  }
);

MentionTextarea.displayName = 'MentionTextarea';
export default MentionTextarea;