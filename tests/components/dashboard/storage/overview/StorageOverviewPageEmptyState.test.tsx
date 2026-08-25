import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  HardDrive: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="hard-drive-icon" {...props} />,
}));

import { EmptyState } from '@/components/shared/EmptyState';
import { HardDrive } from 'lucide-react';

describe('StorageOverviewPage EmptyState', () => {
  it('renders the shared empty state', () => {
    render(
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState icon={HardDrive} title="No Workspaces Found" description="You need to be a member of at least one workspace to view storage." />
      </div>
    );
    expect(screen.getByTestId('hard-drive-icon')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState icon={HardDrive} title="No Workspaces Found" description="You need to be a member of at least one workspace to view storage." />
      </div>
    );
    expect(screen.getByText('No Workspaces Found')).toBeInTheDocument();
  });

  it('displays the correct description', () => {
    render(
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState icon={HardDrive} title="No Workspaces Found" description="You need to be a member of at least one workspace to view storage." />
      </div>
    );
    expect(screen.getByText(/You need to be a member of at least one workspace/)).toBeInTheDocument();
  });
});
