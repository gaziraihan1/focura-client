import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('lucide-react', () => ({
  Building2: (props: any) => <svg data-testid="building-icon" {...props} />,
}));

import { WorkspaceQuickFilter } from '@/components/Dashboard/AllProjects/WorkspaceQuickFilter';

const workspaces = [
  { id: 'ws1', name: 'Alpha', slug: 'alpha' },
  { id: 'ws2', name: 'Beta', slug: 'beta' },
];

describe('WorkspaceQuickFilter', () => {
  it('returns null when workspaces are empty', () => {
    const { container } = render(
      <WorkspaceQuickFilter workspaces={[]} selectedWorkspaceId="all" onSelectWorkspace={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders "All Workspaces" button and workspace names', () => {
    render(
      <WorkspaceQuickFilter workspaces={workspaces} selectedWorkspaceId="all" onSelectWorkspace={vi.fn()} />
    );
    expect(screen.getByText('All Workspaces')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('calls onSelectWorkspace with "all" when All button clicked', () => {
    const onSelect = vi.fn();
    render(
      <WorkspaceQuickFilter workspaces={workspaces} selectedWorkspaceId="all" onSelectWorkspace={onSelect} />
    );
    fireEvent.click(screen.getByText('All Workspaces'));
    expect(onSelect).toHaveBeenCalledWith('all');
  });

  it('calls onSelectWorkspace with workspace id', () => {
    const onSelect = vi.fn();
    render(
      <WorkspaceQuickFilter workspaces={workspaces} selectedWorkspaceId="all" onSelectWorkspace={onSelect} />
    );
    fireEvent.click(screen.getByText('Alpha'));
    expect(onSelect).toHaveBeenCalledWith('ws1');
  });
});
