import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  HardDrive: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="hard-drive-icon" {...props} />,
}));

vi.mock('@/components/Shared/EmptyState', () => ({
  EmptyState: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="shared-empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

import { EmptyState } from '@/components/Dashboard/Storage/StorageOverviewPage/EmptyState';

describe('StorageOverviewPage EmptyState', () => {
  it('renders the shared empty state', () => {
    render(<EmptyState />);
    expect(screen.getByTestId('shared-empty-state')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<EmptyState />);
    expect(screen.getByText('No Workspaces Found')).toBeInTheDocument();
  });

  it('displays the correct description', () => {
    render(<EmptyState />);
    expect(screen.getByText(/You need to be a member of at least one workspace/)).toBeInTheDocument();
  });
});
