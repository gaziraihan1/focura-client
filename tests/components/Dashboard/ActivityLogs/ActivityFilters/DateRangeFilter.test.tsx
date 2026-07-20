import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
}));

import { DateRangeFilter } from '@/components/Dashboard/ActivityLogs/ActivityFilters/DateRangeFilter';

describe('DateRangeFilter', () => {
  it('renders From and To labels', () => {
    render(
      <DateRangeFilter
        filters={{}}
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <DateRangeFilter
        filters={{}}
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /close custom date range/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onStartDateChange when start date input changes', () => {
    const onStartDateChange = vi.fn();
    const { container } = render(
      <DateRangeFilter
        filters={{}}
        onStartDateChange={onStartDateChange}
        onEndDateChange={vi.fn()}
        onClose={vi.fn()}
      />
    );
    const dateInputs = container.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[0], {
      target: { value: '2026-07-01' },
    });
    expect(onStartDateChange).toHaveBeenCalledWith('2026-07-01');
  });
});
