import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AllTaskTab from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskTab/AllTaskTab';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AllTaskTab', () => {
  it('should render when activeTab is "all"', () => {
    render(
      <AllTaskTab activeTab="all" allTasksContent={<div>Task List</div>} />,
    );
    expect(screen.getByText('Task List')).toBeInTheDocument();
  });

  it('should not render when activeTab is "primary"', () => {
    render(
      <AllTaskTab activeTab="primary" allTasksContent={<div>Task List</div>} />,
    );
    expect(screen.queryByText('Task List')).not.toBeInTheDocument();
  });

  it('should show info banner', () => {
    render(
      <AllTaskTab activeTab="all" allTasksContent={<div />} />,
    );
    expect(screen.getByText('How to organize your tasks:')).toBeInTheDocument();
  });

  it('should explain primary task button', () => {
    render(
      <AllTaskTab activeTab="all" allTasksContent={<div />} />,
    );
    expect(screen.getByText(/Primary/)).toBeInTheDocument();
  });

  it('should explain secondary task button', () => {
    render(
      <AllTaskTab activeTab="all" allTasksContent={<div />} />,
    );
    expect(screen.getByText(/Secondary/)).toBeInTheDocument();
  });

  it('should mention daily reset', () => {
    render(
      <AllTaskTab activeTab="all" allTasksContent={<div />} />,
    );
    expect(screen.getByText(/reset daily at midnight/)).toBeInTheDocument();
  });
});
