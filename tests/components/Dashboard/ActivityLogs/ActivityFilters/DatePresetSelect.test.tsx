import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePresetSelect } from '@/components/Dashboard/ActivityLogs/ActivityFilters/DatePresetSelect';

const options = [
  { value: 'today' as const, label: 'Today' },
  { value: 'week' as const, label: 'This Week' },
];

describe('DatePresetSelect', () => {
  it('renders default option and provided options', () => {
    render(<DatePresetSelect options={options} onChange={vi.fn()} />);
    expect(screen.getByText('Filter by date')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('This Week')).toBeInTheDocument();
  });

  it('calls onChange with selected value', () => {
    const onChange = vi.fn();
    render(<DatePresetSelect options={options} onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'week' } });
    expect(onChange).toHaveBeenCalledWith('week');
  });
});
