import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskTabHeader from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskTab/TaskTabHeader';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TaskTabHeader', () => {
  it('should render both tabs', () => {
    render(<TaskTabHeader activeTab="all" onActiveTab={vi.fn()} />);
    expect(screen.getByText('All Tasks')).toBeInTheDocument();
    expect(screen.getByText('Primary')).toBeInTheDocument();
  });

  it('should highlight "all" tab when activeTab is "all"', () => {
    render(<TaskTabHeader activeTab="all" onActiveTab={vi.fn()} />);
    const allButton = screen.getByText('All Tasks');
    expect(allButton.className).toContain('text-foreground');
  });

  it('should highlight "primary" tab when activeTab is "primary"', () => {
    render(<TaskTabHeader activeTab="primary" onActiveTab={vi.fn()} />);
    const primaryButton = screen.getByText('Primary');
    expect(primaryButton.className).toContain('text-foreground');
  });

  it('should dim "primary" tab when activeTab is "all"', () => {
    render(<TaskTabHeader activeTab="all" onActiveTab={vi.fn()} />);
    const primaryButton = screen.getByText('Primary');
    expect(primaryButton.className).toContain('text-muted-foreground');
  });

  it('should dim "all" tab when activeTab is "primary"', () => {
    render(<TaskTabHeader activeTab="primary" onActiveTab={vi.fn()} />);
    const allButton = screen.getByText('All Tasks');
    expect(allButton.className).toContain('text-muted-foreground');
  });

  it('should call onActiveTab with "all" when All Tasks is clicked', () => {
    const onActiveTab = vi.fn();
    render(<TaskTabHeader activeTab="primary" onActiveTab={onActiveTab} />);
    fireEvent.click(screen.getByText('All Tasks'));
    expect(onActiveTab).toHaveBeenCalledWith('all');
  });

  it('should call onActiveTab with "primary" when Primary is clicked', () => {
    const onActiveTab = vi.fn();
    render(<TaskTabHeader activeTab="all" onActiveTab={onActiveTab} />);
    fireEvent.click(screen.getByText('Primary'));
    expect(onActiveTab).toHaveBeenCalledWith('primary');
  });

  it('should show active indicator on selected tab', () => {
    render(<TaskTabHeader activeTab="all" onActiveTab={vi.fn()} />);
    const allButton = screen.getByText('All Tasks');
    // The active tab should have a bottom border indicator
    expect(allButton.querySelector('.bg-primary')).toBeInTheDocument();
  });
});
