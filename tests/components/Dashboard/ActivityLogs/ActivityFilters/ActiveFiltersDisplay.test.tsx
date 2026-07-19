import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  Filter: (props: any) => <svg data-testid="filter-icon" {...props} />,
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
}));

vi.mock('@/components/Dashboard/ActivityLogs/ActivityFilters/ActiveFiltersBadge', () => ({
  ActiveFiltersBadge: ({ label, value, onClear }: any) => (
    <span data-testid={`badge-${label}`}>
      {label}: {value}
    </span>
  ),
}));

import { ActiveFiltersDisplay } from '@/components/Dashboard/ActivityLogs/ActivityFilters/ActiveFiltersDisplay';

describe('ActiveFiltersDisplay', () => {
  it('renders nothing when no filters active', () => {
    const { container } = render(
      <ActiveFiltersDisplay
        filters={{}}
        onClearAction={vi.fn()}
        onClearEntityType={vi.fn()}
        onClearDateRange={vi.fn()}
      />
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows action badge when action filter is set', () => {
    render(
      <ActiveFiltersDisplay
        filters={{ action: 'CREATED' }}
        onClearAction={vi.fn()}
        onClearEntityType={vi.fn()}
        onClearDateRange={vi.fn()}
      />
    );
    expect(screen.getByText(/Active filters/)).toBeInTheDocument();
    expect(screen.getByText(/Action/)).toBeInTheDocument();
  });

  it('shows all three badges when all filters active', () => {
    render(
      <ActiveFiltersDisplay
        filters={{ action: 'UPDATED', entityType: 'TASK', startDate: '2026-01-01', endDate: '2026-01-31' }}
        onClearAction={vi.fn()}
        onClearEntityType={vi.fn()}
        onClearDateRange={vi.fn()}
      />
    );
    expect(screen.getByText(/Action/)).toBeInTheDocument();
    expect(screen.getByText(/Type/)).toBeInTheDocument();
    expect(screen.getByText(/Date Range/)).toBeInTheDocument();
  });
});
