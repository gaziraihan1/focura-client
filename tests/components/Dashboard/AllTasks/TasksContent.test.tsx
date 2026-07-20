import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TasksContent } from '@/components/Dashboard/AllTasks/TasksContent';

vi.mock('@/components/Dashboard/AllTasks/TaskList', () => ({
  TaskList: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-list">{props.tasks.length} tasks</div>,
}));

vi.mock('@/components/Shared/Pagination', () => ({
  Pagination: (props: Record<string, unknown>) => (
    <div data-testid="pagination">
      Page {props.currentPage} of {props.totalPages}
    </div>
  ),
}));

const baseProps = {
  tasks: [],
  isLoading: false,
  isError: false,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
  onCreateTask: vi.fn(),
  onPageChange: vi.fn(),
};

describe('TasksContent', () => {
  it('renders TaskList', () => {
    render(<TasksContent {...baseProps} />);
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
  });

  it('hides Pagination when totalPages is 1', () => {
    render(<TasksContent {...baseProps} totalPages={1} />);
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('shows Pagination when totalPages > 1', () => {
    render(<TasksContent {...baseProps} totalPages={3} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('passes tasks array to TaskList', () => {
    const tasks = [{ id: '1', title: 'Task A' }] as any;
    render(<TasksContent {...baseProps} tasks={tasks} />);
    expect(screen.getByText('1 tasks')).toBeInTheDocument();
  });
});
