import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useIntegrations,
  useIntegration,
  useIsConnected,
  useIntegrationStats,
  integrationKeys,
} from '@/hooks/integration/useIntegrations';
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useIntegrations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch integrations successfully', async () => {
    vi.mocked(api.get).mockResolvedValue({
      success: true,
      data: mockIntegrations,
    });

    const { result } = renderHook(() => useIntegrations(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockIntegrations);
    expect(api.get).toHaveBeenCalledWith('/api/v1/user/integrations', {
      showErrorToast: false,
    });
  });

  it('should return empty array on error', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useIntegrations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // data should be undefined on error (React Query default)
    expect(result.current.data).toBeUndefined();
  });
});

describe('useIntegration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should find specific integration by provider', async () => {
    vi.mocked(api.get).mockResolvedValue({
      success: true,
      data: mockIntegrations,
    });

    const { result } = renderHook(() => useIntegration('github'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.integration).toEqual(mockIntegrations[0]);
  });

  it('should return undefined for non-existent provider', async () => {
    vi.mocked(api.get).mockResolvedValue({
      success: true,
      data: mockIntegrations,
    });

    const { result } = renderHook(() => useIntegration('trello'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.integration).toBeUndefined();
  });
});

describe('useIsConnected', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true for connected provider', async () => {
    vi.mocked(api.get).mockResolvedValue({
      success: true,
      data: mockIntegrations,
    });

    const { result } = renderHook(() => useIsConnected('github'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should return false for disconnected provider', async () => {
    vi.mocked(api.get).mockResolvedValue({
      success: true,
      data: mockIntegrations,
    });

    const { result } = renderHook(() => useIsConnected('slack'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });
});

describe('useIntegrationStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate stats correctly', async () => {
    vi.mocked(api.get).mockResolvedValue({
      success: true,
      data: mockIntegrations,
    });

    const { result } = renderHook(() => useIntegrationStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.total).toBe(2);
    expect(result.current.active).toBe(1);
    expect(result.current.inactive).toBe(1);
    expect(result.current.needsAttention).toBe(0);
  });

  it('should return zeros when loading', () => {
    vi.mocked(api.get).mockReturnValue(new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useIntegrationStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.total).toBe(0);
    expect(result.current.active).toBe(0);
  });
});

describe('integrationKeys', () => {
  it('should generate correct query keys', () => {
    expect(integrationKeys.all).toEqual(['integrations']);
    expect(integrationKeys.lists()).toEqual(['integrations', 'list']);
    expect(integrationKeys.list()).toEqual(['integrations', 'list']);
    expect(integrationKeys.details()).toEqual(['integrations', 'detail']);
    expect(integrationKeys.detail('123')).toEqual(['integrations', 'detail', '123']);
    expect(integrationKeys.byProvider('github')).toEqual(['integrations', 'provider', 'github']);
  });
});
