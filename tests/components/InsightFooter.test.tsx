import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InsightFooter } from '@/components/Dashboard/KanbanView/InsightFooter';
import type { Task } from '@/hooks/useTask';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/hooks/useKanbanInsightFooter', () => ({
  useKanbanInsightFooter: vi.fn(() => ({
    insights: {
      avgCycleTime: 3.5,
      completedThisWeek: 12,
      bottleneckColumn: 'IN_PROGRESS',
      totalInProgress: 5,
      oldestTaskAge: 7,
      oldestTaskTitle: 'Old task title',
    },
  })),
}));

// ─── Test Data ────────────────────────────────────────────────────────────────

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task',
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('InsightFooter', () => {
  it('should render the title', () => {
    render(<InsightFooter tasks={mockTasks} onClose={vi.fn()} />);
    expect(screen.getByText('Execution Insights')).toBeInTheDocument();
  });

  it('should render avg cycle time', () => {
    render(<InsightFooter tasks={mockTasks} onClose={vi.fn()} />);
    // Check for the label - the value is split across elements
    expect(screen.getByText('Avg Cycle Time')).toBeInTheDocument();
  });

  it('should render completed this week', () => {
    render(<InsightFooter tasks={mockTasks} onClose={vi.fn()} />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('tasks')).toBeInTheDocument();
  });

  it('should render bottleneck column', () => {
    render(<InsightFooter tasks={mockTasks} onClose={vi.fn()} />);
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
  });

  it('should render oldest task age', () => {
    render(<InsightFooter tasks={mockTasks} onClose={vi.fn()} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should render oldest task title', () => {
    render(<InsightFooter tasks={mockTasks} onClose={vi.fn()} />);
    expect(screen.getByText('Old task title')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<InsightFooter tasks={mockTasks} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should render the footer message', () => {
    render(<InsightFooter tasks={mockTasks} onClose={vi.fn()} />);
    expect(screen.getByText(/Kanban = real-time execution/)).toBeInTheDocument();
  });
});
