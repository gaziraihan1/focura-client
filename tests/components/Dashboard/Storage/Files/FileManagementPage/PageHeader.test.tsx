import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    Files: icon('files-icon'),
  };
});

vi.mock('@/components/Dashboard/Storage/WorkspaceSwitcher', () => ({
  WorkspaceSwitcher: ({ currentWorkspaceId }: { currentWorkspaceId: string }) => (
    <div data-testid="workspace-switcher" data-ws-id={currentWorkspaceId} />
  ),
}));

import { PageHeader } from '@/components/Dashboard/Storage/Files/FileManagementPage/PageHeader';

describe('PageHeader', () => {
  it('renders the Files heading', () => {
    render(<PageHeader isAdmin={false} />);
    expect(screen.getByText('Files')).toBeInTheDocument();
  });

  it('shows admin description when isAdmin is true', () => {
    render(<PageHeader isAdmin={true} />);
    expect(screen.getByText('Manage all workspace files')).toBeInTheDocument();
  });

  it('shows member description when isAdmin is false', () => {
    render(<PageHeader isAdmin={false} />);
    expect(screen.getByText('View and manage your uploaded files')).toBeInTheDocument();
  });

  it('renders the files icon', () => {
    render(<PageHeader isAdmin={false} />);
    expect(screen.getByTestId('files-icon')).toBeInTheDocument();
  });

  it('renders WorkspaceSwitcher when props are provided', () => {
    render(
      <PageHeader
        isAdmin={false}
        selectedWorkspaceId="ws-1"
        setSelectedWorkspaceId={vi.fn()}
      />
    );
    expect(screen.getByTestId('workspace-switcher')).toBeInTheDocument();
  });

  it('does not render WorkspaceSwitcher when not provided', () => {
    render(<PageHeader isAdmin={false} />);
    expect(screen.queryByTestId('workspace-switcher')).not.toBeInTheDocument();
  });

  it('does not render WorkspaceSwitcher when only selectedWorkspaceId is provided', () => {
    render(<PageHeader isAdmin={false} selectedWorkspaceId="ws-1" />);
    expect(screen.queryByTestId('workspace-switcher')).not.toBeInTheDocument();
  });

  it('does not render WorkspaceSwitcher when only setSelectedWorkspaceId is provided', () => {
    render(<PageHeader isAdmin={false} setSelectedWorkspaceId={vi.fn()} />);
    expect(screen.queryByTestId('workspace-switcher')).not.toBeInTheDocument();
  });

  it('passes correct workspace id to WorkspaceSwitcher', () => {
    render(
      <PageHeader
        isAdmin={false}
        selectedWorkspaceId="ws-42"
        setSelectedWorkspaceId={vi.fn()}
      />
    );
    expect(screen.getByTestId('workspace-switcher')).toHaveAttribute('data-ws-id', 'ws-42');
  });
});
