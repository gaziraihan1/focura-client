// types/comments-list.types.ts
import type { TaskComment } from './task.types';

export interface CommentsListProps {
  taskId: string;
  comments: TaskComment[];
  currentUserId?: string;
  onEdit: (commentId: string, taskId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => void;
  onReply: (comment: TaskComment) => void;
}

export interface CommentItemProps {
  comment: TaskComment & { replies?: TaskComment[] };
  currentUserId?: string;
  onDelete: (id: string) => void;
  onReply: (comment: TaskComment) => void;
  isReply?: boolean;
}

export type CommentTree = (TaskComment & { replies: TaskComment[] })[];

// types/mention-textarea.types.ts

export interface MentionUser {
  id: string;
  name: string;
  image?: string | null;
  role?: string;
}

export interface MentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  mentionableUsers?: MentionUser[];
  disabled?: boolean;
  minRows?: number;
  maxRows?: number;
  className?: string;
  autoFocus?: boolean;
}

export interface MentionTextareaHandle {
  focus: () => void;
  insertText: (text: string) => void;
}

export interface MentionPart {
  type: 'text' | 'mention';
  value: string;
}

export interface CaretCoordinates {
  top: number;
  left: number;
}

export interface DropdownPosition {
  top: number;
  left: number;
}