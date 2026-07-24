import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WorkspaceIntegrationsForm } from '@/components/Settings/WorkspaceIntegrationsForm';
import { api } from '@/lib/axios';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// ─── Test Setup ───────────────────────────────────────────────────────────────

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

const mockIntegrations = [
  {
    id: 'ws-int-1',
    name: 'GitHub',
    provider: 'github',
    active: true,
    connectedAt: '2024-01-15T10:00:00Z',
    connectedBy: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
    syncStatus: { lastSyncStatus: 'success', lastSyncAt: '2024-01-15T12:00:00Z' },
  },
];

const mockMembers = [
  { id: 'mem-1', userId: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'OWNER' },
  { id: 'mem-2', userId: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'MEMBER' },
];

const defaultProps = {
  workspaceSlug: 'test-workspace',
  workspaceId: 'ws-1',
  isAdmin: true,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WorkspaceIntegrationsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockImplementation((endpoint: string) => {
      if (endpoint.includes('integrations')) {
        return Promise.resolve({ success: true, data: mockIntegrations });
      }
      if (endpoint.includes('members')) {
        return Promise.resolve({ success: true, data: mockMembers });
      }
      return Promise.resolve({ success: true, data: [] });
    });
  });

  it('should render loading state initially', async () => {
    // Create a promise that never resolves to simulate loading
    const neverResolve = new Promise(() => {});
    vi.mocked(api.get).mockReturnValue(neverResolve as any);

    const { container } = render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    // During loading, the component shows a spinner
    const loadingDiv = container.querySelector('.animate-spin');
    expect(loadingDiv).toBeInTheDocument();
  });

  it('should render integrations after loading', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    expect(screen.getByText('Slack')).toBeInTheDocument();
    expect(screen.getByText('Google Calendar')).toBeInTheDocument();
    expect(screen.getByText('Trello')).toBeInTheDocument();
  });

  it('should show connected status for connected integrations', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });

  it('should show who connected the integration', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Connected by John Doe')).toBeInTheDocument();
    });
  });

  it('should show configure button for admins', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} isAdmin={true} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Configure')).toBeInTheDocument();
    });
  });

  it('should hide configure button for non-admins', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} isAdmin={false} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    expect(screen.queryByText('Configure')).not.toBeInTheDocument();
  });

  it('should show admin notice for non-admins', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} isAdmin={false} />, { wrapper: createWrapper() });

    await waitFor(() => {
      // Use a more specific query to match only the admin notice text
      expect(screen.getByText(/Only workspace admins can connect or configure integrations\. You can view/)).toBeInTheDocument();
    });
  });

  it('should disable connect button for non-admins', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} isAdmin={false} />, { wrapper: createWrapper() });

    await waitFor(() => {
      const connectButtons = screen.getAllByText('Connect');
      connectButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  it('should show integration categories', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Development')).toBeInTheDocument();
    });

    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Productivity')).toBeInTheDocument();
    expect(screen.getByText('Project Management')).toBeInTheDocument();
  });

  it('should expand details when chevron is clicked', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    // Find and click expand button
    const expandButtons = screen.getAllByLabelText('Expand details');
    fireEvent.click(expandButtons[0]);

    // Should show features section
    await waitFor(() => {
      expect(screen.getByText('Features')).toBeInTheDocument();
    });
  });

  it('should show workspace integration notice', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('About Workspace Integrations')).toBeInTheDocument();
    });
  });

  it('should show summary stats', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      // Check that stats are displayed using getAllByText
      const activeElements = screen.getAllByText(/active/);
      expect(activeElements.length).toBeGreaterThan(0);
    });

    const inactiveElements = screen.getAllByText(/inactive/);
    expect(inactiveElements.length).toBeGreaterThan(0);
  });

  it('should open ConfirmModal when disconnect is clicked', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    // Click disconnect button on the connected integration (GitHub)
    const disconnectButtons = screen.getAllByText('Disconnect');
    fireEvent.click(disconnectButtons[0]);

    // Should show ConfirmModal with disconnect confirmation
    await waitFor(() => {
      expect(screen.getByText(/Disconnect GitHub\?/)).toBeInTheDocument();
      expect(screen.getByText(/This will revoke access and affect all workspace members/)).toBeInTheDocument();
    });
  });

  it('should call delete API when disconnect is confirmed', async () => {
    vi.mocked(api.delete).mockResolvedValue({ success: true });

    render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    // Click disconnect
    const disconnectButtons = screen.getAllByText('Disconnect');
    fireEvent.click(disconnectButtons[0]);

    // Confirm in the modal
    await waitFor(() => {
      expect(screen.getByText(/Disconnect GitHub\?/)).toBeInTheDocument();
    });

    const confirmButton = screen.getAllByRole('button', { name: /^Disconnect$/i }).pop()!;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/workspace-integrations/'),
      );
    });
  });

  it('should not call delete API when disconnect is cancelled', async () => {
    render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    // Click disconnect
    const disconnectButtons = screen.getAllByText('Disconnect');
    fireEvent.click(disconnectButtons[0]);

    // Cancel in the modal
    await waitFor(() => {
      expect(screen.getByText(/Disconnect GitHub\?/)).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    // Modal should close and no delete call
    await waitFor(() => {
      expect(screen.queryByText(/Disconnect GitHub\?/)).not.toBeInTheDocument();
    });
    expect(api.delete).not.toHaveBeenCalled();
  });

  it('should store workspace slug in sessionStorage when connect is clicked', async () => {
    const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');
    vi.mocked(api.post).mockResolvedValue({
      success: true,
      data: { authUrl: 'https://github.com/login/oauth/authorize?...' },
    });

    const mockHref = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { set href(val: string) { mockHref(val); }, get href() { return ''; } },
      writable: true,
    });

    render(<WorkspaceIntegrationsForm {...defaultProps} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    // Click connect on a non-connected integration
    const connectButtons = screen.getAllByText('Connect');
    fireEvent.click(connectButtons[0]);

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith(
        'integration_workspace_slug',
        'test-workspace',
      );
    });

    mockSetItem.mockRestore();
  });
});
