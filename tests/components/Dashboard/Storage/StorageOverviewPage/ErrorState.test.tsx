import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    AlertTriangle: icon('alert-triangle'),
  };
});

import { ErrorState } from '@/components/Dashboard/Storage/StorageOverviewPage/ErrorState';

describe('StorageOverviewPage ErrorState', () => {
  it('renders the error title', () => {
    render(<ErrorState />);
    expect(screen.getByText('Failed to load storage data')).toBeInTheDocument();
  });

  it('renders the default error message when no error is provided', () => {
    render(<ErrorState />);
    expect(screen.getByText('There was an error loading storage information.')).toBeInTheDocument();
  });

  it('renders the default error message when error is null', () => {
    render(<ErrorState error={null} />);
    expect(screen.getByText('There was an error loading storage information.')).toBeInTheDocument();
  });

  it('renders the error message from an Error object', () => {
    render(<ErrorState error={new Error('Disk quota exceeded')} />);
    expect(screen.getByText('Disk quota exceeded')).toBeInTheDocument();
  });

  it('renders the alert triangle icon', () => {
    render(<ErrorState />);
    expect(screen.getByTestId('alert-triangle')).toBeInTheDocument();
  });
});
