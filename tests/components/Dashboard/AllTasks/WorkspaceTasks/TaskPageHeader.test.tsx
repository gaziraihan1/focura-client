import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  Plus: (props: any) => <svg data-testid="plus-icon" {...props} />,
}));

import { TasksPageHeader } from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskPageHeader';

describe('TasksPageHeader', () => {
  it('renders workspace name in subtitle', () => {
    render(<TasksPageHeader workspaceName="My Workspace" onCreateTask={vi.fn()} memberRole="ADMIN" />);
    expect(screen.getByText(/My Workspace/)).toBeInTheDocument();
  });

  it('shows New Task button for non-guest roles', () => {
    render(<TasksPageHeader workspaceName="WS" onCreateTask={vi.fn()} memberRole="MEMBER" />);
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('hides New Task button for GUEST role', () => {
    render(<TasksPageHeader workspaceName="WS" onCreateTask={vi.fn()} memberRole="GUEST" />);
    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
  });

  it('calls onCreateTask when button clicked', () => {
    const onCreate = vi.fn();
    render(<TasksPageHeader workspaceName="WS" onCreateTask={onCreate} memberRole="ADMIN" />);
    fireEvent.click(screen.getByText('New Task'));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });
});
