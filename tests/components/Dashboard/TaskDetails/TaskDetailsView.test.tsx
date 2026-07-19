import { describe, it, expect, vi } from 'vitest';
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

vi.mock('@/components/Dashboard/TaskDetails/TaskDetailsMainLayout', () => ({
  default: () => <div data-testid="task-main-layout" />,
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

describe('TaskDetailsView', () => {
  it('renders the task header', () => {
    render(
      <TaskDetailsView
        task={mockTask}
        permissions={defaultPermissions}
        isEditing={false}
        handlers={defaultHandlers}
        mutations={defaultMutations}
        id="1"
        workspaceSlug="test-workspace"
      />,
    );
    expect(screen.getByTestId('task-header')).toBeInTheDocument();
  });

  it('shows archived project warning', () => {
    const archivedTask = { ...mockTask, project: { status: 'ARCHIVED' } };
    render(
      <TaskDetailsView
        task={archivedTask}
        permissions={defaultPermissions}
        isEditing={false}
        handlers={defaultHandlers}
        mutations={defaultMutations}
        id="1"
        workspaceSlug="test-workspace"
      />,
    );
    expect(screen.getByText(/archived/)).toBeInTheDocument();
  });

  it('shows personal task badge', () => {
    const personalTask = { ...mockTask, projectId: null, project: null };
    render(
      <TaskDetailsView
        task={personalTask}
        permissions={defaultPermissions}
        isEditing={false}
        handlers={defaultHandlers}
        mutations={defaultMutations}
        id="1"
        workspaceSlug="test-workspace"
      />,
    );
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });
});
