import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubtaskRow } from '@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskRow';

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...filterDomProps(props)}>{props.children}</div>,
    button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...filterDomProps(props)}>{props.children}</button>,
  },
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' '),
}));

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name, ...props }: Record<string, unknown>) => <div data-testid="avatar" data-name={name} />,
}));

vi.mock('@/components/Dashboard/TaskDetails/SubtasksSection/StatusButton', () => ({
  StatusButton: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="status-button" data-status={props.status} />,
}));

vi.mock('@/components/Dashboard/TaskDetails/SubtasksSection/InlineEditor', () => ({
  InlineEditor: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="inline-editor" />,
}));

function filterDomProps(props: Record<string, unknown>) {
  const dom: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (k === 'children' || k === 'initial' || k === 'animate' || k === 'exit' || k === 'transition' || k === 'whileTap' || k === 'layout') continue;
    if (k.startsWith('on') || k === 'className' || k === 'disabled' || k === 'title' || k === 'type' || k === 'style') dom[k] = v;
  }
  return dom;
}

function makeSubtask(overrides: Record<string, unknown> = {}) {
  return {
    id: 'st-1',
    title: 'Test subtask',
    status: 'TODO',
    priority: 'MEDIUM',
    createdById: 'user-1',
    createdBy: { id: 'user-1', name: 'Alice', image: null },
    assignees: [],
    createdAt: '2025-01-15T10:00:00Z',
    dueDate: null,
    ...overrides,
  };
}

describe('SubtaskRow', () => {
  const defaultProps = {
    currentUserId: 'user-1',
    isAssignee: true,
    onStatusChange: vi.fn(),
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders the subtask title', () => {
    render(<SubtaskRow subtask={makeSubtask()} {...defaultProps} />);
    expect(screen.getByText('Test subtask')).toBeInTheDocument();
  });

  it('renders the creator name', () => {
    render(<SubtaskRow subtask={makeSubtask()} {...defaultProps} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('applies line-through when subtask is completed', () => {
    render(<SubtaskRow subtask={makeSubtask({ status: 'COMPLETED' })} {...defaultProps} />);
    const title = screen.getByText('Test subtask');
    expect(title.className).toContain('line-through');
  });

  it('renders the priority dot', () => {
    render(<SubtaskRow subtask={makeSubtask({ priority: 'URGENT' })} {...defaultProps} />);
    const dot = screen.getByTitle('URGENT');
    expect(dot.className).toContain('bg-red-600');
  });
});
