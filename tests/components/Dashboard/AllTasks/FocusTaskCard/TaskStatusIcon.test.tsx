import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  CheckCircle2: (props: any) => <svg data-testid="check-icon" {...props} />,
  Clock: (props: any) => <svg data-testid="clock-icon" {...props} />,
}));

vi.mock('@/utils/task.utils', () => ({
  getStatusColor: (status: string) => `color-${status}`,
}));

import { TaskStatusIcon } from '@/components/Dashboard/AllTasks/FocusTaskCard/TaskStatusIcon';

describe('TaskStatusIcon', () => {
  it('renders CheckCircle2 for COMPLETED status', () => {
    render(<TaskStatusIcon status="COMPLETED" />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('renders Clock for non-COMPLETED status', () => {
    render(<TaskStatusIcon status="IN_PROGRESS" />);
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('applies status color class', () => {
    const { container } = render(<TaskStatusIcon status="TODO" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('color-TODO');
  });
});
