import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskDetailsView from '@/components/Dashboard/TaskDetails/TaskDetailsView';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn() }),
}));

vi.mock('@/hooks/useTask', () => ({
  useUpdateTask: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteTask: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateTaskStatus: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useAddComment: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUploadAttachment: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteAttachment: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock('@/hooks/useComment', () => ({
  useUpdateComment: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteComment: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock('@/components/Dashboard/TaskDetails/TaskHeader', () => ({
  TaskHeader: () => <div data-testid="task-header" />,
}));

vi.mock('@/components/Dashboard/TaskDetails/FocusSessionCard', () => ({
  FocusSessionCard: () => <div data-testid="focus-session-card" />,
}));

vi.mock('@/components/Dashboard/TaskDetails/FocusRequirementsCard', () => ({
  FocusRequirementsCard: () => <div data-testid="focus-requirements-card" />,
}));

vi.mock('@/components/Dashboard/TaskDetails/TimeTrackingCard', () => ({
  TimeTrackingCard: () => <div data-testid="time-tracking-card" />,
}));

vi.mock('@/components/Dashboard/TaskDetails/IntentBadge', () => ({
  IntentBadge: () => <div data-testid="intent-badge" />,
}));

let mockMainLayoutProps: Record<string, unknown> | null = null;
vi.mock('@/components/Dashboard/TaskDetails/TaskDetailsMainLayout', () => ({
  default: (props: Record<string, unknown>) => {
    mockMainLayoutProps = props;
    return <div data-testid="task-main-layout" />;
  },
}));

const mockTask = {
  id: '1',
  title: 'Test Task',
  status: 'TODO',
  priority: 'MEDIUM',
  intent: 'MAINTAIN',
  focusRequired: false,
  focusLevel: null,
  energyType: null,
  distractionCost: null,
  timeTracking: null,
  estimatedHours: null,
  projectId: 'p1',
  project: null,
  createdBy: { id: 'u1', name: 'Test User' },
  assignees: [],
  labels: [],
  subtasks: [],
  comments: [],
  attachments: [],
  dueDate: null,
  startDate: null,
  createdAt: new Date().toISOString(),
  description: '',
} as any;

const defaultHandlers = {
  handleEditClick: vi.fn(),
  handleDelete: vi.fn(),
} as any;

const defaultPermissions = {
  canEdit: true,
  canDelete: true,
  canView: true,
  reason: null,
} as any;

const defaultMutations = {
  addComment: { mutateAsync: vi.fn(), isPending: false },
  updateComment: { mutateAsync: vi.fn(), isPending: false },
  deleteComment: { mutateAsync: vi.fn(), isPending: false },
  uploadAttachment: { mutateAsync: vi.fn(), isPending: false },
  deleteAttachment: { mutateAsync: vi.fn(), isPending: false },
  updateTask: { mutateAsync: vi.fn(), isPending: false },
  deleteTask: { mutateAsync: vi.fn(), isPending: false },
  updateStatus: { mutateAsync: vi.fn(), isPending: false },
} as any;

const defaultEditData = {
  title: 'Test Task',
  description: '',
  priority: 'MEDIUM',
  status: 'TODO',
  estimatedHours: '',
};

function renderView(overrides: Record<string, unknown> = {}) {
  return render(
    <TaskDetailsView
      task={mockTask}
      permissions={defaultPermissions}
      isEditing={false}
      editData={defaultEditData}
      setIsEditing={vi.fn()}
      setEditData={vi.fn()}
      comments={[]}
      attachments={[]}
      handlers={defaultHandlers}
      mutations={defaultMutations}
      workspaceSlug="test-workspace"
      {...(overrides as any)}
    />,
  );
}

describe('TaskDetailsView', () => {
  beforeEach(() => {
    mockMainLayoutProps = null;
  });

  it('renders the task header', () => {
    renderView();
    expect(screen.getByTestId('task-header')).toBeInTheDocument();
  });

  it('shows archived project warning', () => {
    renderView({ task: { ...mockTask, project: { status: 'ARCHIVED' } } });
    expect(screen.getByText(/archived/)).toBeInTheDocument();
  });

  it('shows personal task badge', () => {
    renderView({ task: { ...mockTask, projectId: null, project: null } });
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('forwards controller state to the main layout', () => {
    const comments = [
      {
        id: 'c1',
        content: 'Nice work',
        createdAt: '2025-01-01T00:00:00Z',
        user: { id: 'u1', name: 'A', email: '' },
        parentId: null,
      },
    ];
    renderView({ isEditing: true, comments });

    expect(mockMainLayoutProps).toMatchObject({
      task: mockTask,
      isEditing: true,
      editData: defaultEditData,
      comments,
      attachments: [],
      permissions: defaultPermissions,
      workspaceSlug: 'test-workspace',
    });
    expect(mockMainLayoutProps?.setIsEditing).toBeTypeOf('function');
    expect(mockMainLayoutProps?.setEditData).toBeTypeOf('function');
  });
});
