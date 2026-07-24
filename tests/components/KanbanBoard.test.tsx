import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KanbanBoard } from '@/components/Dashboard/KanbanView/KanbanBoard';
import type { Task } from '@/hooks/useTask';
import type { KanbanSort } from '@/hooks/useKanbanPage';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/hooks/useKanbanBoard', () => ({
  useKanbanBoard: vi.fn(() => ({
    isMobile: false,
    currentColumnIndex: 0,
    visibleColumns: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'COMPLETED'],
    sortedTasksByColumn: {
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      BLOCKED: [],
      COMPLETED: [],
    },
    columnStats: {
      TODO: { count: 0, avgDays: 0, isBottleneck: false },
      IN_PROGRESS: { count: 0, avgDays: 0, isBottleneck: false },
      IN_REVIEW: { count: 0, avgDays: 0, isBottleneck: false },
      BLOCKED: { count: 0, avgDays: 0, isBottleneck: false },
      COMPLETED: { count: 0, avgDays: 0, isBottleneck: false },
    },
    handlePreviousColumn: vi.fn(),
    handleNextColumn: vi.fn(),
  })),
}));

vi.mock('@/components/Dashboard/KanbanView/KanbanBoard/MobileColumnNavigator', () => ({
  MobileColumnNavigator: () => <div data-testid="mobile-navigator" />,
}));

vi.mock('@/components/Dashboard/KanbanView/KanbanBoard/KanbanBoardLoadingState', () => ({
  KanbanBoardLoadingState: () => <div data-testid="loading-state">Loading...</div>,
}));

vi.mock('@/components/Dashboard/KanbanView/KanbanBoard/KanbanColumnsContainer', () => ({
  KanbanColumnsContainer: () => <div data-testid="columns-container" />,
}));

// ─── Test Data ────────────────────────────────────────────────────────────────

const mockTasks: Task[] = [];
const mockSort: KanbanSort = 'priority';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('KanbanBoard', () => {
  it('should render loading state when isLoading is true', () => {
    render(
      <KanbanBoard
        tasks={mockTasks}
        sort={mockSort}
        enforceWIP={false}
        focusMode={false}
        onTaskClick={vi.fn()}
        isLoading={true}
      />,
    );
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('should render columns container when not loading', () => {
    render(
      <KanbanBoard
        tasks={mockTasks}
        sort={mockSort}
        enforceWIP={false}
        focusMode={false}
        onTaskClick={vi.fn()}
        isLoading={false}
      />,
    );
    expect(screen.getByTestId('columns-container')).toBeInTheDocument();
  });

  it('should not render mobile navigator on desktop', () => {
    render(
      <KanbanBoard
        tasks={mockTasks}
        sort={mockSort}
        enforceWIP={false}
        focusMode={false}
        onTaskClick={vi.fn()}
        isLoading={false}
      />,
    );
    expect(screen.queryByTestId('mobile-navigator')).not.toBeInTheDocument();
  });
});
