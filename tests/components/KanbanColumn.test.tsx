import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KanbanColumn } from '@/components/Dashboard/KanbanView/KanbanColumn';
import type { Task } from '@/hooks/useTask';
import type { ColumnConfig } from '@/hooks/useKanbanBoard';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/components/Dashboard/KanbanView/KanbanCard', () => ({
  KanbanCard: ({ task }: { task: Task }) => (
    <div data-testid="kanban-card">{task.title}</div>
  ),
}));

vi.mock('@/components/Dashboard/KanbanView/KanbanColumn/KanbanColumnHeader', () => ({
  __esModule: true,
  default: ({ column, stats }: { column: ColumnConfig; stats: any }) => (
    <div data-testid="column-header">
      {column.title} - {stats.count} tasks
    </div>
  ),
}));

vi.mock('@/components/Dashboard/KanbanView/KanbanColumn/EmptyKanbanColumnState', () => ({
  __esModule: true,
  default: () => <div data-testid="empty-state">No tasks</div>,
}));

// ─── Test Data ────────────────────────────────────────────────────────────────

const mockColumn: ColumnConfig = {
  id: 'todo',
  title: 'Backlog',
  statuses: ['TODO'],
  wipLimit: 20,
  color: 'gray',
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    status: 'TODO',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: null,
    description: '',
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
    _count: { subtasks: 0, comments: 0, files: 0 },
  } as Task,
];

const mockStats = {
  count: 1,
  avgDays: 2.5,
  isBottleneck: false,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('KanbanColumn', () => {
  it('should render column header', () => {
    render(
      <KanbanColumn
        column={mockColumn}
        tasks={mockTasks}
        stats={mockStats}
        enforceWIP={false}
        onTaskClick={vi.fn()}
      />,
    );
    expect(screen.getByTestId('column-header')).toBeInTheDocument();
  });

  it('should render tasks when tasks exist', () => {
    render(
      <KanbanColumn
        column={mockColumn}
        tasks={mockTasks}
        stats={mockStats}
        enforceWIP={false}
        onTaskClick={vi.fn()}
      />,
    );
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('should render empty state when no tasks', () => {
    render(
      <KanbanColumn
        column={mockColumn}
        tasks={[]}
        stats={{ count: 0, avgDays: 0, isBottleneck: false }}
        enforceWIP={false}
        onTaskClick={vi.fn()}
      />,
    );
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('should render mobile layout when isMobile is true', () => {
    const { container } = render(
      <KanbanColumn
        column={mockColumn}
        tasks={mockTasks}
        stats={mockStats}
        enforceWIP={false}
        onTaskClick={vi.fn()}
        isMobile={true}
      />,
    );
    const column = container.firstChild as HTMLElement;
    expect(column.className).toContain('w-full');
  });

  it('should render desktop layout when isMobile is false', () => {
    const { container } = render(
      <KanbanColumn
        column={mockColumn}
        tasks={mockTasks}
        stats={mockStats}
        enforceWIP={false}
        onTaskClick={vi.fn()}
        isMobile={false}
      />,
    );
    const column = container.firstChild as HTMLElement;
    expect(column.className).toContain('w-[280px]');
  });

  it('should apply bottleneck style when stats.isBottleneck is true', () => {
    const { container } = render(
      <KanbanColumn
        column={mockColumn}
        tasks={mockTasks}
        stats={{ ...mockStats, isBottleneck: true }}
        enforceWIP={false}
        onTaskClick={vi.fn()}
      />,
    );
    const column = container.firstChild as HTMLElement;
    expect(column.className).toContain('bg-amber-500/5');
  });

  it('should apply blocked style when column id is blocked', () => {
    const blockedColumn: ColumnConfig = {
      ...mockColumn,
      id: 'blocked',
    };
    const { container } = render(
      <KanbanColumn
        column={blockedColumn}
        tasks={mockTasks}
        stats={mockStats}
        enforceWIP={false}
        onTaskClick={vi.fn()}
      />,
    );
    const column = container.firstChild as HTMLElement;
    expect(column.className).toContain('bg-destructive/5');
  });
});
