import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrimaryTaskTab from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskTab/PrimaryTaskTab';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PrimaryTaskTab', () => {
  it('should render when activeTab is "primary"', () => {
    render(
      <PrimaryTaskTab
        activeTab="primary"
        primaryTasksContent={<div>Primary Tasks</div>}
      />,
    );
    expect(screen.getByText('Primary Tasks')).toBeInTheDocument();
  });

  it('should not render when activeTab is "all"', () => {
    render(
      <PrimaryTaskTab
        activeTab="all"
        primaryTasksContent={<div>Primary Tasks</div>}
      />,
    );
    expect(screen.queryByText('Primary Tasks')).not.toBeInTheDocument();
  });

  it('should show info banner title', () => {
    render(
      <PrimaryTaskTab activeTab="primary" primaryTasksContent={<div />} />,
    );
    expect(screen.getByText('Your Daily Focus')).toBeInTheDocument();
  });

  it('should explain primary task', () => {
    render(
      <PrimaryTaskTab activeTab="primary" primaryTasksContent={<div />} />,
    );
    // The text is split across elements - check for the label
    expect(screen.getByText('Primary:')).toBeInTheDocument();
  });

  it('should explain secondary tasks', () => {
    render(
      <PrimaryTaskTab activeTab="primary" primaryTasksContent={<div />} />,
    );
    // The text is split across elements - check for the label
    expect(screen.getByText('Secondary:')).toBeInTheDocument();
  });

  it('should mention daily reset', () => {
    render(
      <PrimaryTaskTab activeTab="primary" primaryTasksContent={<div />} />,
    );
    expect(screen.getByText(/reset daily at midnight/)).toBeInTheDocument();
  });

  it('should mention personal nature', () => {
    render(
      <PrimaryTaskTab activeTab="primary" primaryTasksContent={<div />} />,
    );
    expect(screen.getByText(/personal to you/)).toBeInTheDocument();
  });
});
