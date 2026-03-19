// hooks/useMentionTextarea.ts
import { useState, useCallback, useMemo } from 'react';
import { getCaretCoordinates } from '@/utils/comments.utils';
import type { MentionUser, DropdownPosition } from '@/types/comment.types';

export function useCommentPage(
  value: string,
  onChange: (value: string) => void,
  mentionableUsers: MentionUser[],
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
) {
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionStart, setMentionStart] = useState<number>(-1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition | null>(null);
  

  const filteredUsers = useMemo(() => {
  if (mentionQuery === null) return [];

  return mentionableUsers.filter((u) =>
    u.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );
}, [mentionQuery, mentionableUsers]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      onChange(text);

      const cursor = e.target.selectionStart;
      const textBefore = text.slice(0, cursor);
      const mentionMatch = textBefore.match(/@([a-zA-Z0-9 ]*)$/);

      if (mentionMatch) {
        const query = mentionMatch[1];
        const start = cursor - query.length - 1;
        setMentionQuery(query);
        setMentionStart(start);
        setActiveIndex(0);

        if (textareaRef.current) {
          const coords = getCaretCoordinates(textareaRef.current);
          if (coords) {
            setDropdownPos({ top: coords.top + 24, left: Math.max(0, coords.left) });
          }
        }
      } else {
        setMentionQuery(null);
        setMentionStart(-1);
      }
    },
    [onChange, textareaRef]
  );

  const insertMention = useCallback(
    (user: MentionUser) => {
      const before = value.slice(0, mentionStart);
      const after = value.slice(textareaRef.current?.selectionStart ?? mentionStart);
      const mention = `@[${user.name}](${user.id}) `;
      const newVal = before + mention + after;
      onChange(newVal);
      setMentionQuery(null);
      setMentionStart(-1);
      setTimeout(() => {
        const el = textareaRef.current;
        if (el) {
          const pos = before.length + mention.length;
          el.selectionStart = el.selectionEnd = pos;
          el.focus();
        }
      }, 0);
    },
    [value, mentionStart, onChange, textareaRef]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>, onSubmit?: () => void) => {
      if (mentionQuery !== null && filteredUsers.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % filteredUsers.length);
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActiveIndex((i) => (i - 1 + filteredUsers.length) % filteredUsers.length);
          return;
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault();
          insertMention(filteredUsers[activeIndex]);
          return;
        }
        if (e.key === 'Escape') {
          setMentionQuery(null);
          return;
        }
      }

      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onSubmit?.();
      }
    },
    [mentionQuery, filteredUsers, activeIndex, insertMention]
  );

  return {
    mentionQuery,
    filteredUsers,
    activeIndex,
    dropdownPos,
    handleChange,
    insertMention,
    handleKeyDown,
  };
}