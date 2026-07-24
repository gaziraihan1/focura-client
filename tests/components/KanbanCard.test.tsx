import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanCard } from '@/components/Dashboard/KanbanView/KanbanCard';
import type { Task } from '@/hooks/useTask';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/hooks/useKanbanCard', () => ({
  useKanbanCard: vi.fn(() => ({
    daysStale: 3,
    agingStatus: 'normal',
    isOverdue: false,
    subtaskProgress: { completed: 2, total: 5 },
    getPriorityColor: () => 'border-l-blue-500',
    getAgingBorder: () => '',
  })),
}));

vi.mock('@/components/Dashboard/KanbanView/KanbanCard/KanbanCardHeader', () => ({
  KanbanCardHeader: () => <div data-testid="card-header" />,
}));

vi.mock('@/components/Dashboard/KanbanView/KanbanCard/KanbanCardTitle', () => ({
  KanbanCardTitle: ({ title }: { title: string }) => (
    <div data-testid="card-title">{title}</div>
  ),
}));

vi.mock('@/components/Dashboard/KanbanView/KanbanCard/KanbanCardMetadata', () => ({
  KanbanCardMetadata: () => <div data-testid="card-metadata" />,
}));

vi.mock('@/components/Dashboard/KanbanView/KanbanCard/KanbanCardFooter', () => ({
  KanbanCardFooter: () => <div data-testid="card-footer" />,
}));

vi.mock('@/components/Dashboard/KanbanView/KanbanCard/KanbanCardProjectIndicator', () => ({
  KanbanCardProjectIndicator: () => <div data-testid="card-project" />,
}));

// ─── Test Data ────────────────────────────────────────────────────────────────

const mockTask: Task = {
  id: '1',
  title: 'Test Task Title',
  status: 'TODO',
  priority: 'MEDIUM',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  dueDate: null,
  description: 'Test description',
  intent: 'NONE',
  energyType: null,
  focusRequired: false,
  distractionCost: null,
  workspaceId: 'ws-1',
  projectId: null,
  parentTaskId: null,
  createdById: 'user-1',
  project: null,
  assignees: [],
  labels: [],
  _count: { subtasks: 5, comments: 3, files: 1 },
} as Task;

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('KanbanCard', () => {
  it('should render task title', () => {
    render(<KanbanCard task={mockTask} onClick={vi.fn()} />);
    expect(screen.getByText('Test Task Title')).toBeInTheDocument();
  });

  it('should render card header', () => {
    render(<KanbanCard task={mockTask} onClick={vi.fn()} />);
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
  });

  it('should render card metadata', () => {
    render(<KanbanCard task={mockTask} onClick={vi.fn()} />);
    expect(screen.getByTestId('card-metadata')).toBeInTheDocument();
  });

  it('should render card footer', () => {
    render(<KanbanCard task={mockTask} onClick={vi.fn()} />);
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
  });

  it('should render project indicator', () => {
    render(<KanbanCard task={mockTask} onClick={vi.fn()} />);
    expect(screen.getByTestId('card-project')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    const onClick = vi.fn();
    render(<KanbanCard task={mockTask} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('should apply blocked styles when isBlocked is true', () => {
    render(<KanbanCard task={mockTask} onClick={vi.fn()} isBlocked={true} />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-destructive/10');
  });

  it('should have accessible button role', () => {
    render(<KanbanCard task={mockTask} onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
