import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    AlertTriangle: icon('alert-triangle'),
    RefreshCw: icon('refresh-cw'),
  };
});

vi.mock('@/lib/error/error', () => ({
  getErrorMessage: (error: unknown, fallback: string) => {
    if (error instanceof Error) return error.message;
    return fallback;
  },
}));

import { ErrorState } from '@/components/Dashboard/Storage/Files/FileManagementPage/ErrorState';

describe('ErrorState', () => {
  it('renders the default error message when error is unknown', () => {
    render(<ErrorState error={null} onRetry={vi.fn()} />);
    expect(screen.getByText('Failed to Load Files')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred while loading files.')).toBeInTheDocument();
  });

  it('renders the error message from an Error object', () => {
    render(<ErrorState error={new Error('Network timeout')} onRetry={vi.fn()} />);
    expect(screen.getByText('Failed to Load Files')).toBeInTheDocument();
    expect(screen.getByText('Network timeout')).toBeInTheDocument();
  });

  it('shows Access Restricted for access/permission errors', () => {
    render(<ErrorState error={new Error('Access denied')} onRetry={vi.fn()} />);
    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(screen.getByText('Contact your workspace admin to request file access.')).toBeInTheDocument();
  });

  it('shows Access Restricted for permission errors', () => {
    render(<ErrorState error={new Error('No permission')} onRetry={vi.fn()} />);
    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
  });

  it('calls onRetry when Try Again button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState error={null} onRetry={onRetry} />);
    await user.click(screen.getByText('Try Again'));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders the alert triangle icon', () => {
    render(<ErrorState error={null} onRetry={vi.fn()} />);
    expect(screen.getByTestId('alert-triangle')).toBeInTheDocument();
  });

  it('renders the refresh icon in the button', () => {
    render(<ErrorState error={null} onRetry={vi.fn()} />);
    expect(screen.getByTestId('refresh-cw')).toBeInTheDocument();
  });
});
