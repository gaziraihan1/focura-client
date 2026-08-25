import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  Plus: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="plus-icon" {...props} />,
}));

vi.mock('@/components/dashboard/tasks/all-tasks/workspace-tasks/TaskTab/TaskTabHeader', () => ({
  default: ({ activeTab, onActiveTab }: Record<string, unknown>) => (
    <div data-testid="tab-header">
      <button data-testid="btn-all" onClick={() => onActiveTab('all')}>All</button>
      <button data-testid="btn-primary" onClick={() => onActiveTab('primary')}>Primary</button>
      <span data-testid="active-tab">{activeTab}</span>
    </div>
  ),
}));

vi.mock('@/components/dashboard/tasks/all-tasks/workspace-tasks/TaskTab/AllTaskTab', () => ({
  default: ({ activeTab, allTasksContent }: Record<string, unknown>) =>
    activeTab === 'all' ? <div data-testid="all-tab">{allTasksContent}</div> : null,
}));

vi.mock('@/components/dashboard/tasks/all-tasks/workspace-tasks/TaskTab/PrimaryTaskTab', () => ({
  default: ({ activeTab, primaryTasksContent }: Record<string, unknown>) =>
    activeTab === 'primary' ? <div data-testid="primary-tab">{primaryTasksContent}</div> : null,
}));

import { TaskTabs } from '@/components/dashboard/tasks/all-tasks/workspace-tasks/TaskTabs';

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
