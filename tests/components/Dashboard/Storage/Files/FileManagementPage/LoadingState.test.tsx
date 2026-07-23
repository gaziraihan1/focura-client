import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/components/Shared/LoadingState', () => ({
  LoadingState: () => <div data-testid="shared-loading-state" />,
}));

import { LoadingState } from '@/components/Dashboard/Storage/Files/FileManagementPage/LoadingState';

describe('LoadingState', () => {
  it('renders the loading state with loading text', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading files...')).toBeInTheDocument();
  });

  it('renders the shared loading state component', () => {
    render(<LoadingState />);
    expect(screen.getByTestId('shared-loading-state')).toBeInTheDocument();
  });
});
