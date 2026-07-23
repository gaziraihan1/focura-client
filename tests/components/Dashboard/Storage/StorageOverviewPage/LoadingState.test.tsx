import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/components/Shared/LoadingState', () => ({
  LoadingState: () => <div data-testid="shared-loading-state" />,
}));

import { LoadingState } from '@/components/Dashboard/Storage/StorageOverviewPage/LoadingState';

describe('StorageOverviewPage LoadingState', () => {
  it('renders the default loading message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading workspaces...')).toBeInTheDocument();
  });

  it('renders the shared loading state component', () => {
    render(<LoadingState />);
    expect(screen.getByTestId('shared-loading-state')).toBeInTheDocument();
  });

  it('renders a custom message when provided', () => {
    render(<LoadingState message="Fetching data..." />);
    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  it('does not render the default message when custom message is provided', () => {
    render(<LoadingState message="Custom loading..." />);
    expect(screen.queryByText('Loading workspaces...')).not.toBeInTheDocument();
  });
});
