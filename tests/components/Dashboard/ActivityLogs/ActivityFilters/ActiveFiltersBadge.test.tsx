import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
}));

import { ActiveFiltersBadge } from '@/components/Dashboard/ActivityLogs/ActivityFilters/ActiveFiltersBadge';

describe('ActiveFiltersBadge', () => {
  it('renders label and value', () => {
    render(<ActiveFiltersBadge label="Action" value="Created" onClear={vi.fn()} />);
    expect(screen.getByText(/Action/)).toBeInTheDocument();
    expect(screen.getByText(/Created/)).toBeInTheDocument();
  });

  it('calls onClear when X button clicked', () => {
    const onClear = vi.fn();
    render(<ActiveFiltersBadge label="Type" value="Task" onClear={onClear} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('has accessible aria-label', () => {
    render(<ActiveFiltersBadge label="Date" value="Today" onClear={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Clear date filter');
  });
});
