import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CommentEditor } from '@/components/Dashboard/TaskDetails/TaskTab/CommentEditor';

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('@/components/Dashboard/TaskDetails/TaskTab/MentionTextarea', () => ({
  default: React.forwardRef(({ value, onChange, onSubmit, placeholder, ...props }: any, ref: any) => (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
      placeholder={placeholder}
      {...props}
    />
  )),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
    button: (props: any) => <button {...props} />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockTask = {
  id: '1',
  title: 'Test Task',
  status: 'TODO',
  priority: 'MEDIUM',
  createdAt: new Date().toISOString(),
  createdBy: { id: 'u1', name: 'Test User', email: 'test@test.com' },
  project: null,
  projectId: 'p1',
  assignees: [],
  labels: [],
  subtasks: [],
  comments: [],
  attachments: [],
  timeTracking: null,
  intent: 'MAINTAIN',
} as any;

describe('CommentEditor', () => {
  it('renders the comment textarea', () => {
    render(
      <CommentEditor
        task={mockTask}
        canComment={true}
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    expect(screen.getByPlaceholderText(/Add a comment/)).toBeInTheDocument();
  });

  it('shows lock message when cannot comment', () => {
    render(
      <CommentEditor
        task={mockTask}
        canComment={false}
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    expect(screen.getByText(/don't have permission/)).toBeInTheDocument();
  });

  it('renders reply button text when replying', () => {
    render(
      <CommentEditor
        task={mockTask}
        canComment={true}
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        loading={false}
        replyingTo={{ id: 'c1', content: 'test comment', user: { id: 'u1', name: 'Alice' } } as any}
      />,
    );
    expect(screen.getByText('Reply')).toBeInTheDocument();
  });
});
