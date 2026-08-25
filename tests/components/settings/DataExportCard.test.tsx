import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataExportCard } from '@/components/settings/DataExportCard';
import { api } from '@/lib/axios';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/axios', () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: vi.fn(() => ({
    data: { email: 'test@focura.com' },
    isLoading: false,
  })),
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/lib/a11y', () => ({
  announce: vi.fn(),
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DataExportCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.post).mockResolvedValue({ success: true });
  });

  it('renders the privacy card with an export button', () => {
    render(<DataExportCard />);
    expect(screen.getByText('Privacy & Data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export my data' })).toBeInTheDocument();
  });

  it('calls the export endpoint when the button is clicked', async () => {
    render(<DataExportCard />);
    fireEvent.click(screen.getByRole('button', { name: 'Export my data' }));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/v1/user/export-data');
    });
  });

  it('shows a success message with the user email after requesting', async () => {
    const toast = (await import('react-hot-toast')).default;
    render(<DataExportCard />);
    fireEvent.click(screen.getByRole('button', { name: 'Export my data' }));

    await waitFor(() => {
      expect(
        screen.getByText(/Export requested — it will arrive at test@focura\.com/)
      ).toBeInTheDocument();
    });
    expect(toast.success).toHaveBeenCalledWith('Export requested — check your email');
    // Button is disabled after a successful request
    expect(screen.getByRole('button', { name: 'Export my data' })).toBeDisabled();
  });

  it('shows an error message when the request fails', async () => {
    const toast = (await import('react-hot-toast')).default;
    vi.mocked(api.post).mockRejectedValue(new Error('network'));

    render(<DataExportCard />);
    fireEvent.click(screen.getByRole('button', { name: 'Export my data' }));

    await waitFor(() => {
      expect(
        screen.getByText('Failed to request your export. Please try again later.')
      ).toBeInTheDocument();
    });
    expect(toast.error).toHaveBeenCalledWith('Failed to request data export');
  });
});
