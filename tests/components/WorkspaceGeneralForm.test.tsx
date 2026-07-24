import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WorkspaceGeneralForm } from '@/components/Settings/WorkspaceGeneralForm';
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

const mockWorkspace = {
  id: 'ws-1',
  name: 'Test Workspace',
  description: 'A test workspace',
  color: '#3B82F6',
  isPublic: false,
  allowInvites: true,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WorkspaceGeneralForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockResolvedValue({
      success: true,
      data: mockWorkspace,
    });
    vi.mocked(api.put).mockResolvedValue({
      success: true,
      data: mockWorkspace,
    });
  });

  it('should render loading state initially', () => {
    vi.mocked(api.get).mockReturnValue(new Promise(() => {}));

    render(<WorkspaceGeneralForm workspaceSlug="test-workspace" />, {
      wrapper: createWrapper(),
    });

    expect(screen.queryByText('General Settings')).not.toBeInTheDocument();
  });

  it('should render form fields after loading', async () => {
    render(<WorkspaceGeneralForm workspaceSlug="test-workspace" />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('General Settings')).toBeInTheDocument();
    });

    expect(screen.getByText('Workspace Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Workspace Color')).toBeInTheDocument();
  });

  it('should populate workspace name field', async () => {
    render(<WorkspaceGeneralForm workspaceSlug="test-workspace" />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      const nameInput = screen.getByDisplayValue('Test Workspace');
      expect(nameInput).toBeInTheDocument();
    });
  });

  it('should populate description field', async () => {
    render(<WorkspaceGeneralForm workspaceSlug="test-workspace" />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      const descInput = screen.getByDisplayValue('A test workspace');
      expect(descInput).toBeInTheDocument();
    });
  });

  it('should show visibility options', async () => {
    render(<WorkspaceGeneralForm workspaceSlug="test-workspace" />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('Public workspace')).toBeInTheDocument();
      expect(screen.getByText('Allow invitations')).toBeInTheDocument();
    });
  });

  it('should show save button', async () => {
    render(<WorkspaceGeneralForm workspaceSlug="test-workspace" />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });

  it('should update name when input changes', async () => {
    render(<WorkspaceGeneralForm workspaceSlug="test-workspace" />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('General Settings')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Test Workspace');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput).toHaveValue('New Name');
  });

  it('should show color picker options', async () => {
    render(<WorkspaceGeneralForm workspaceSlug="test-workspace" />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('Workspace Color')).toBeInTheDocument();
    });

    // Should have 8 color buttons
    const colorButtons = screen.getAllByRole('button').filter(
      (btn) => btn.style.backgroundColor,
    );
    expect(colorButtons.length).toBe(8);
  });

  it('should render public workspace checkbox', async () => {
    render(<WorkspaceGeneralForm workspaceSlug="test-workspace" />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('Public workspace')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox', { name: /public workspace/i });
    expect(checkbox).toBeInTheDocument();
  });

  it('should render allow invitations checkbox', async () => {
    render(<WorkspaceGeneralForm workspaceSlug="test-workspace" />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('Allow invitations')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox', { name: /allow invitations/i });
    expect(checkbox).toBeInTheDocument();
  });
});
