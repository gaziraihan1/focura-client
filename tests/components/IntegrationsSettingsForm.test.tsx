import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { IntegrationsSettingsForm } from '@/components/Settings/IntegrationsSettingsForm';
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
    id: 'int-1',
    name: 'GitHub',
    provider: 'github',
    active: true,
    connectedAt: '2024-01-15T10:00:00Z',
    config: { syncDirection: 'two-way' },
    syncStatus: { lastSyncStatus: 'success', lastSyncAt: '2024-01-15T12:00:00Z' },
  },
  {
    id: 'int-2',
    name: 'Slack',
    provider: 'slack',
    active: false,
    connectedAt: '2024-01-10T08:00:00Z',
  },
];

const mockWorkspaces = [
  { id: 'ws-1', name: 'Test Workspace', slug: 'test-workspace' },
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('IntegrationsSettingsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockImplementation((endpoint: string) => {
      if (endpoint.includes('integrations')) {
        return Promise.resolve({ success: true, data: mockIntegrations });
      }
      if (endpoint.includes('workspaces')) {
        return Promise.resolve({ success: true, data: mockWorkspaces });
      }
      return Promise.resolve({ success: true, data: [] });
    });
  });

  it('should render loading state initially', async () => {
    // Create a promise that never resolves to simulate loading
    const neverResolve = new Promise(() => {});
    vi.mocked(api.get).mockReturnValue(neverResolve as any);

    const { container } = render(<IntegrationsSettingsForm />, { wrapper: createWrapper() });

    // During loading, the component shows a spinner
    // Check that the container has the loading class
    const loadingDiv = container.querySelector('.animate-spin');
    expect(loadingDiv).toBeInTheDocument();
  });

  it('should render integrations after loading', async () => {
    render(<IntegrationsSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    expect(screen.getByText('Slack')).toBeInTheDocument();
    expect(screen.getByText('Google Calendar')).toBeInTheDocument();
  });

  it('should show connected status for connected integrations', async () => {
    render(<IntegrationsSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });

  it('should show configure button for connected integrations', async () => {
    render(<IntegrationsSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Configure')).toBeInTheDocument();
    });
  });

  it('should show disconnect button for connected integrations', async () => {
    render(<IntegrationsSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Disconnect')).toBeInTheDocument();
    });
  });

  it('should show connect button for disconnected integrations', async () => {
    render(<IntegrationsSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      const connectButtons = screen.getAllByText('Connect');
      expect(connectButtons.length).toBeGreaterThan(0);
    });
  });

  it('should call auth endpoint when connect is clicked', async () => {
    vi.mocked(api.post).mockResolvedValue({
      success: true,
      data: { authUrl: 'https://github.com/login/oauth/authorize?...' },
    });

    // Mock window.location.href
    const mockHref = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { set href(val: string) { mockHref(val); }, get href() { return ''; } },
      writable: true,
    });

    render(<IntegrationsSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Slack')).toBeInTheDocument();
    });

    // Click connect on Slack (not connected)
    const connectButtons = screen.getAllByText('Connect');
    // Find the button that's not disabled
    const slackConnectBtn = connectButtons.find(btn => !btn.closest('[class*="green"]'));
    if (slackConnectBtn) {
      fireEvent.click(slackConnectBtn);
    }

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/api/v1/user/integrations/auth',
        expect.objectContaining({ provider: expect.any(String) }),
      );
    });
  });

  it('should expand details when chevron is clicked', async () => {
    render(<IntegrationsSettingsForm />, { wrapper: createWrapper() });

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

  it('should show summary stats', async () => {
    render(<IntegrationsSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      // Check that stats are displayed using getAllByText
      const activeElements = screen.getAllByText(/active/);
      expect(activeElements.length).toBeGreaterThan(0);
    });

    const inactiveElements = screen.getAllByText(/inactive/);
    expect(inactiveElements.length).toBeGreaterThan(0);
  });

  it('should show OAuth notice', async () => {
    render(<IntegrationsSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('About OAuth Connections')).toBeInTheDocument();
    });
  });
});
