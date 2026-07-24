import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WorkspaceIntegrationCard } from '@/components/Settings/WorkspaceIntegrations/WorkspaceIntegrationCard';
import type { IntegrationDefinition, WorkspaceIntegration } from '@/components/Settings/WorkspaceIntegrations/types';
import { Github } from 'lucide-react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// ─── Test Data ────────────────────────────────────────────────────────────────

const mockIntegration: IntegrationDefinition = {
  id: 'github',
  name: 'GitHub',
  description: 'Sync repositories and link PRs to tasks',
  icon: Github,
  color: 'bg-gray-500/10',
  textColor: 'text-gray-600 dark:text-gray-400',
  features: ['Link PRs to tasks', 'Auto-close on merge'],
  category: 'development',
};

const mockConnectedIntegration: WorkspaceIntegration = {
  id: 'int-1',
  name: 'GitHub',
  provider: 'github',
  active: true,
  connectedAt: '2024-01-15T10:00:00Z',
  connectedBy: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
  syncStatus: { lastSyncStatus: 'success', lastSyncAt: '2024-01-15T12:00:00Z' },
};

const defaultProps = {
  integration: mockIntegration,
  isConnecting: false,
  isAdmin: true,
  onConnect: vi.fn(),
  onDisconnect: vi.fn(),
  onConfigure: vi.fn(),
  expanded: false,
  onToggleExpand: vi.fn(),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WorkspaceIntegrationCard', () => {
  it('should render integration name and description', () => {
    render(<WorkspaceIntegrationCard {...defaultProps} />);

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Sync repositories and link PRs to tasks')).toBeInTheDocument();
  });

  it('should show connect button when not connected', () => {
    render(<WorkspaceIntegrationCard {...defaultProps} />);

    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  it('should show connected status when connected', () => {
    render(
      <WorkspaceIntegrationCard
        {...defaultProps}
        connectedIntegration={mockConnectedIntegration}
      />,
    );

    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('should show who connected the integration', () => {
    render(
      <WorkspaceIntegrationCard
        {...defaultProps}
        connectedIntegration={mockConnectedIntegration}
      />,
    );

    expect(screen.getByText('Connected by John Doe')).toBeInTheDocument();
  });

  it('should show configure button for admins when connected', () => {
    render(
      <WorkspaceIntegrationCard
        {...defaultProps}
        connectedIntegration={mockConnectedIntegration}
        isAdmin={true}
      />,
    );

    expect(screen.getByText('Configure')).toBeInTheDocument();
  });

  it('should hide configure button for non-admins', () => {
    render(
      <WorkspaceIntegrationCard
        {...defaultProps}
        connectedIntegration={mockConnectedIntegration}
        isAdmin={false}
      />,
    );

    expect(screen.queryByText('Configure')).not.toBeInTheDocument();
  });

  it('should show disconnect button when connected', () => {
    render(
      <WorkspaceIntegrationCard
        {...defaultProps}
        connectedIntegration={mockConnectedIntegration}
      />,
    );

    expect(screen.getByText('Disconnect')).toBeInTheDocument();
  });

  it('should call onConnect when connect button is clicked', () => {
    const onConnect = vi.fn();
    render(<WorkspaceIntegrationCard {...defaultProps} onConnect={onConnect} />);

    fireEvent.click(screen.getByText('Connect'));
    expect(onConnect).toHaveBeenCalledWith('github');
  });

  it('should call onDisconnect when disconnect button is clicked', () => {
    const onDisconnect = vi.fn();
    render(
      <WorkspaceIntegrationCard
        {...defaultProps}
        connectedIntegration={mockConnectedIntegration}
        onDisconnect={onDisconnect}
      />,
    );

    fireEvent.click(screen.getByText('Disconnect'));
    expect(onDisconnect).toHaveBeenCalledWith('int-1', 'GitHub');
  });

  it('should call onConfigure when configure button is clicked', () => {
    const onConfigure = vi.fn();
    render(
      <WorkspaceIntegrationCard
        {...defaultProps}
        connectedIntegration={mockConnectedIntegration}
        onConfigure={onConfigure}
      />,
    );

    fireEvent.click(screen.getByText('Configure'));
    expect(onConfigure).toHaveBeenCalledWith(mockConnectedIntegration);
  });

  it('should expand details when expand button is clicked', () => {
    const onToggleExpand = vi.fn();
    render(<WorkspaceIntegrationCard {...defaultProps} onToggleExpand={onToggleExpand} />);

    fireEvent.click(screen.getByLabelText('Expand details'));
    expect(onToggleExpand).toHaveBeenCalled();
  });

  it('should show features when expanded', () => {
    render(<WorkspaceIntegrationCard {...defaultProps} expanded={true} />);

    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Link PRs to tasks')).toBeInTheDocument();
  });

  it('should disable connect button for non-admins', () => {
    render(<WorkspaceIntegrationCard {...defaultProps} isAdmin={false} />);

    expect(screen.getByText('Connect')).toBeDisabled();
  });

  it('should show loading state when connecting', () => {
    render(<WorkspaceIntegrationCard {...defaultProps} isConnecting={true} />);

    // The connect button should have a spinner
    expect(screen.getByText('Connect')).toBeDisabled();
  });
});
