import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
}));

vi.mock('@/components/Dashboard/AllTasks/WorkspaceTasks/TaskCard', () => ({
  TaskCard: ({ task }: { task: unknown }) => <div data-testid="task-card">{task.title}</div>,
}));

import { RemovableTaskCard } from '@/components/Dashboard/AllTasks/WorkspaceTasks/RemovalTaskCard';

const mockTask = {
  id: 't1',
  title: 'Test Task',
  description: '',
  status: 'TODO' as const,
  priority: 'MEDIUM' as const,
  dueDate: null,
  startDate: null,
  completedAt: null,
  estimatedHours: null,
  actualHours: null,
  createdAt: '',
  updatedAt: '',
  projectId: null,
  intent: 'EXECUTION' as const,
  createdBy: { id: 'u1', name: 'User' },
  assignees: [],
  labels: [],
  _count: { comments: 0, subtasks: 0, files: 0 },
};

describe('RemovableTaskCard', () => {
  it('renders the underlying TaskCard', () => {
    render(
      <RemovableTaskCard
        task={mockTask}
        workspaceSlug="ws"
        isRemoving={false}
        onRemove={vi.fn()}
        accentColor="purple"
      />
    );
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('calls onRemove when X button clicked', () => {
    const onRemove = vi.fn();
    render(
      <RemovableTaskCard
        task={mockTask}
        workspaceSlug="ws"
        isRemoving={false}
        onRemove={onRemove}
        accentColor="amber"
      />
    );
    fireEvent.click(screen.getByTestId('x-icon').closest('button')!);
    expect(onRemove).toHaveBeenCalledWith('t1');
  });

  it('disables the button while removing', () => {
    render(
      <RemovableTaskCard
        task={mockTask}
        workspaceSlug="ws"
        isRemoving={true}
        onRemove={vi.fn()}
        accentColor="purple"
      />
    );
    const btn = screen.getByRole('button', { name: /remove/i });
    expect(btn).toBeDisabled();
  });
});
