import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    Shield: icon('shield-icon'),
    Users: icon('users-icon'),
  };
});

vi.mock('@/components/Dashboard/Storage/WorkspaceSwitcher', () => ({
  WorkspaceSwitcher: ({ currentWorkspaceId }: { currentWorkspaceId: string }) => (
    <div data-testid="workspace-switcher" data-ws-id={currentWorkspaceId} />
  ),
}));

import { PageHeader } from '@/components/Dashboard/Storage/StorageOverviewPage/PageHeader';

describe('StorageOverviewPage PageHeader', () => {
  const defaultProps = {
    selectedWorkspaceId: 'ws-1',
    isAdmin: false,
    onWorkspaceChange: vi.fn(),
  };

  it('renders the title', () => {
    render(<PageHeader {...defaultProps} />);
    expect(screen.getByText('Storage Overview')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<PageHeader {...defaultProps} />);
    expect(screen.getByText('Monitor and manage workspace file storage')).toBeInTheDocument();
  });

  it('renders the WorkspaceSwitcher', () => {
    render(<PageHeader {...defaultProps} />);
    expect(screen.getByTestId('workspace-switcher')).toBeInTheDocument();
  });

  it('passes correct workspace id to WorkspaceSwitcher', () => {
    render(<PageHeader {...defaultProps} selectedWorkspaceId="ws-42" />);
    expect(screen.getByTestId('workspace-switcher')).toHaveAttribute('data-ws-id', 'ws-42');
  });

  it('shows Admin view badge when isAdmin is true', () => {
    render(<PageHeader {...defaultProps} isAdmin={true} />);
    expect(screen.getByText('Admin view')).toBeInTheDocument();
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
  });

  it('shows Member badge when isAdmin is false', () => {
    render(<PageHeader {...defaultProps} isAdmin={false} />);
    expect(screen.getByText('Member')).toBeInTheDocument();
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
  });

  it('does not show shield icon for non-admin', () => {
    render(<PageHeader {...defaultProps} isAdmin={false} />);
    expect(screen.queryByTestId('shield-icon')).not.toBeInTheDocument();
  });

  it('does not show users icon for admin', () => {
    render(<PageHeader {...defaultProps} isAdmin={true} />);
    expect(screen.queryByTestId('users-icon')).not.toBeInTheDocument();
  });
});
