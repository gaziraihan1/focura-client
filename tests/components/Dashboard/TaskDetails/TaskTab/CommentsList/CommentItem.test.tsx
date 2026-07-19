import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommentItem } from '@/components/Dashboard/TaskDetails/TaskTab/CommentsList/CommentItem';

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...filterProps(props)}>{props.children}</div>,
    span: (props: any) => <span {...filterProps(props)}>{props.children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: any) => <svg data-testid={name} {...props} />;
  return {
    Trash2: icon('trash2'),
    CornerDownRight: icon('corner-down-right'),
    MessageSquare: icon('message-square'),
    ChevronDown: icon('chevron-down'),
    Loader2: icon('loader2'),
    Pencil: icon('pencil'),
    Check: icon('check'),
    X: icon('x'),
  };
});

vi.mock('@/lib/utils', () => ({ cn: (...c: any[]) => c.filter(Boolean).join(' ') }));
vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name, ...p }: any) => <div data-testid="avatar" data-name={name} />,
}));
vi.mock('@/components/Dashboard/TaskDetails/TaskTab/CommentsList/CommentContent', () => ({
  CommentContent: ({ content }: any) => <div data-testid="comment-content">{content}</div>,
}));
vi.mock('@/components/Dashboard/TaskDetails/TaskTab/CommentsList/RelativeTime', () => ({
  RelativeTime: ({ date }: any) => <span data-testid="relative-time">{date}</span>,
}));

function filterProps(props: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(props)) {
    if (k === 'children' || k.startsWith('initial') || k.startsWith('animate') || k.startsWith('exit') || k.startsWith('transition') || k === 'layout') continue;
    if (k.startsWith('on') || k === 'className' || k === 'disabled' || k === 'type' || k === 'style') out[k] = v;
  }
  return out;
}

function makeComment(overrides: any = {}) {
  return {
    id: 'c-1',
    content: 'Hello world',
    user: { id: 'user-1', name: 'Alice', image: null },
    createdAt: '2025-01-15T10:00:00Z',
    edited: false,
    replies: [],
    ...overrides,
  };
}

describe('CommentItem', () => {
  const defaultProps = {
    currentUserId: 'user-1',
    onDelete: vi.fn(),
    onReply: vi.fn(),
    onEdit: vi.fn(),
    taskId: 'task-1',
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders comment content', () => {
    render(<CommentItem comment={makeComment()} {...defaultProps} />);
    expect(screen.getByTestId('comment-content')).toHaveTextContent('Hello world');
  });

  it('renders user name', () => {
    render(<CommentItem comment={makeComment()} {...defaultProps} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('shows edited indicator when comment is edited', () => {
    render(<CommentItem comment={makeComment({ edited: true })} {...defaultProps} />);
    expect(screen.getByText('edited')).toBeInTheDocument();
  });

  it('shows Reply button for top-level comments', () => {
    render(<CommentItem comment={makeComment()} {...defaultProps} />);
    expect(screen.getByText('Reply')).toBeInTheDocument();
  });
});
