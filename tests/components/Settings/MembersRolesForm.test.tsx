import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { MembersRolesForm } from '@/components/Settings/MembersRolesForm';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/lib/a11y', () => ({
  announce: vi.fn(),
}));

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: vi.fn(() => ({
    data: {
      id: 'ws-1',
      name: 'Test Workspace',
      slug: 'test-workspace',
    },
  })),
  useWorkspaceMembers: vi.fn(() => ({
    data: [
      { id: 'mem-1', userId: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'OWNER' },
      { id: 'mem-2', userId: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'MEMBER' },
    ],
    isLoading: false,
  })),
  useInviteMember: vi.fn(() => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
  })),
  useRemoveMember: vi.fn(() => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
  })),
  useUpdateMemberRole: vi.fn(() => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
  })),
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MembersRolesForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('should render team members section', async () => {
    render(<MembersRolesForm workspaceSlug="test-workspace" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Team Members')).toBeInTheDocument();
    });
  });

  it('should show invite form', async () => {
    render(<MembersRolesForm workspaceSlug="test-workspace" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Invite Member')).toBeInTheDocument();
    });
  });

  it('should show email input field', async () => {
    render(<MembersRolesForm workspaceSlug="test-workspace" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('colleague@company.com')).toBeInTheDocument();
    });
  });

  it('should show role selector', async () => {
    render(<MembersRolesForm workspaceSlug="test-workspace" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Member')).toBeInTheDocument();
    });
  });

  it('should show invite button', async () => {
    render(<MembersRolesForm workspaceSlug="test-workspace" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Invite')).toBeInTheDocument();
    });
  });
});
