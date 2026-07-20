import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubtaskSection } from '@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskSection';

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...filterProps(props)}>{props.children}</div>,
    button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...filterProps(props)}>{props.children}</button>,
    span: (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...filterProps(props)}>{props.children}</span>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    Plus: icon('plus'),
    ChevronDown: icon('chevron-down'),
    ListTodo: icon('list-todo'),
    Loader2: icon('loader2'),
    Circle: icon('circle'),
    AlertCircle: icon('alert-circle'),
    CheckCircle2: icon('check-circle-2'),
  };
});

vi.mock('@/lib/utils', () => ({ cn: (...c: (string | boolean | undefined | null)[]) => c.filter(Boolean).join(' ') }));
vi.mock('@/hooks/useSubtasks', () => ({
  useSubtasks: vi.fn(() => ({ data: [], isLoading: false })),
  useSubtaskStats: vi.fn(() => ({ data: null })),
  useCreateSubtask: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateSubtask: vi.fn(() => ({ mutateAsync: vi.fn() })),
  useUpdateSubtaskStatus: vi.fn(() => ({ mutateAsync: vi.fn() })),
  useDeleteSubtask: vi.fn(() => ({ mutateAsync: vi.fn() })),
}));
vi.mock('@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskProgress', () => ({ SubtaskProgress: () => <div data-testid="subtask-progress" /> }));
vi.mock('@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskForm', () => ({ SubtaskForm: () => <div data-testid="subtask-form" /> }));
vi.mock('@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskList', () => ({ SubtaskList: () => <div data-testid="subtask-list" /> }));
vi.mock('@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskEmptyState', () => ({ SubtaskEmptyState: () => <div data-testid="subtask-empty" /> }));

function filterProps(props: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (['children', 'initial', 'animate', 'exit', 'transition', 'whileTap', 'layout'].includes(k)) continue;
    if (k.startsWith('on') || k === 'className' || k === 'type') out[k] = v;
  }
  return out;
}

describe('SubtaskSection', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the Subtasks header', () => {
    render(<SubtaskSection parentTaskId="t-1" currentUserId="u-1" isAssignee={true} />);
    expect(screen.getByText('Subtasks')).toBeInTheDocument();
  });

  it('renders empty state when no subtasks', () => {
    render(<SubtaskSection parentTaskId="t-1" currentUserId="u-1" isAssignee={true} />);
    expect(screen.getByTestId('subtask-empty')).toBeInTheDocument();
  });

  it('shows Add button when user is assignee', () => {
    render(<SubtaskSection parentTaskId="t-1" currentUserId="u-1" isAssignee={true} />);
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('hides Add button when user is not assignee', () => {
    render(<SubtaskSection parentTaskId="t-1" currentUserId="u-1" isAssignee={false} />);
    expect(screen.queryByText('Add')).not.toBeInTheDocument();
  });
});
