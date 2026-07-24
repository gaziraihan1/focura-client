import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CapacityScheduleForm } from '@/components/Settings/CapacityScheduleForm';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CapacityScheduleForm', () => {
  it('should render work capacity section', async () => {
    render(<CapacityScheduleForm />);

    await waitFor(() => {
      expect(screen.getByText('Daily Capacity')).toBeInTheDocument();
    });
  });

  it('should render work schedule section', async () => {
    render(<CapacityScheduleForm />);

    await waitFor(() => {
      expect(screen.getByText('Work Schedule')).toBeInTheDocument();
    });
  });

  it('should show day buttons', async () => {
    render(<CapacityScheduleForm />);

    await waitFor(() => {
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Tue')).toBeInTheDocument();
    });
  });

  it('should show save button', async () => {
    render(<CapacityScheduleForm />);

    await waitFor(() => {
      expect(screen.getByText('Save Settings')).toBeInTheDocument();
    });
  });
});
