// utils/comments-list.util.ts
import type { TaskComment } from '@/types/task.types';
import type { CommentTree } from '@/types/comment.types';

export function buildCommentTree(comments: TaskComment[]): CommentTree {
  const map = new Map<string, TaskComment & { replies: TaskComment[] }>();
  const roots: CommentTree = [];

  comments.forEach((c) => map.set(c.id, { ...c, replies: [] }));

  comments.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export function getRelativeTimeLabel(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// utils/mention-textarea.util.ts
import type { MentionPart, CaretCoordinates } from '@/types/comment.types';

export function parseMentions(text: string): MentionPart[] {
  const parts: MentionPart[] = [];
  const regex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'mention', value: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts;
}

export function stripMentionSyntax(text: string): string {
  return text.replace(/@\[([^\]]+)\]\([^)]+\)/g, '@$1');
}

export function getCaretCoordinates(
  textarea: HTMLTextAreaElement
): CaretCoordinates | null {
  const mirror = document.createElement("div");
  const style = window.getComputedStyle(textarea);

  const props: (keyof CSSStyleDeclaration)[] = [
    "boxSizing",
    "width",
    "height",
    "overflowX",
    "overflowY",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderStyle",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "lineHeight",
    "fontFamily",
    "textAlign",
    "letterSpacing",
    "wordSpacing",
  ];

  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";

  props.forEach((p) => {
    const value = style.getPropertyValue(p as string);
    mirror.style.setProperty(p as string, value);
  });

  document.body.appendChild(mirror);

  const textBefore = textarea.value.substring(0, textarea.selectionStart);
  mirror.textContent = textBefore;

  const span = document.createElement("span");
  span.textContent =
    textarea.value.substring(textarea.selectionStart) || ".";
  mirror.appendChild(span);

  const rect = textarea.getBoundingClientRect();
  const spanRect = span.getBoundingClientRect();

  document.body.removeChild(mirror);

  return {
    top: spanRect.top - rect.top + textarea.scrollTop,
    left: spanRect.left - rect.left,
  };
}

export function detectMentionQuery(
  text: string,
  cursorPosition: number
): { query: string; start: number } | null {
  const textBefore = text.slice(0, cursorPosition);
  const mentionMatch = textBefore.match(/@([a-zA-Z0-9 ]*)$/);

  if (mentionMatch) {
    return {
      query: mentionMatch[1],
      start: cursorPosition - mentionMatch[1].length - 1,
    };
  }

  return null;
}