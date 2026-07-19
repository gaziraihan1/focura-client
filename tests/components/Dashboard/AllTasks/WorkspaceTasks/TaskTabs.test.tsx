import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  Plus: (props: any) => <svg data-testid="plus-icon" {...props} />,
}));

vi.mock('@/components/Dashboard/AllTasks/WorkspaceTasks/TaskTab/TaskTabHeader', () => ({
  default: ({ activeTab, onActiveTab }: any) => (
    <div data-testid="tab-header">
      <button data-testid="btn-all" onClick={() => onActiveTab('all')}>All</button>
      <button data-testid="btn-primary" onClick={() => onActiveTab('primary')}>Primary</button>
      <span data-testid="active-tab">{activeTab}</span>
    </div>
  ),
}));

vi.mock('@/components/Dashboard/AllTasks/WorkspaceTasks/TaskTab/AllTaskTab', () => ({
  default: ({ activeTab, allTasksContent }: any) =>
    activeTab === 'all' ? <div data-testid="all-tab">{allTasksContent}</div> : null,
}));

vi.mock('@/components/Dashboard/AllTasks/WorkspaceTasks/TaskTab/PrimaryTaskTab', () => ({
  default: ({ activeTab, primaryTasksContent }: any) =>
    activeTab === 'primary' ? <div data-testid="primary-tab">{primaryTasksContent}</div> : null,
}));

import { TaskTabs } from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskTabs';

describe('TaskTabs', () => {
  it('renders with all tab active by default', () => {
    render(
      <TaskTabs allTasksContent={<span>All Content</span>} primaryTasksContent={<span>Primary Content</span>} />
    );
    expect(screen.getByTestId('all-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('primary-tab')).not.toBeInTheDocument();
  });

  it('switches to primary tab when clicked', () => {
    render(
      <TaskTabs allTasksContent={<span>All Content</span>} primaryTasksContent={<span>Primary Content</span>} />
    );
    fireEvent.click(screen.getByTestId('btn-primary'));
    expect(screen.getByTestId('primary-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('all-tab')).not.toBeInTheDocument();
  });
});
