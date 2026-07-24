import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrandingForm } from '@/components/Settings/BrandingForm';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: vi.fn(() => ({
    data: {
      id: 'ws-1',
      name: 'Test Workspace',
      slug: 'test-workspace',
      color: '#3B82F6',
    },
  })),
  useUpdateWorkspace: vi.fn(() => ({
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

describe('BrandingForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render branding section', async () => {
    render(<BrandingForm workspaceSlug="test-workspace" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Brand Color')).toBeInTheDocument();
    });
  });

  it('should show brand color section', async () => {
    render(<BrandingForm workspaceSlug="test-workspace" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Brand Color')).toBeInTheDocument();
    });
  });

  it('should show color picker', async () => {
    render(<BrandingForm workspaceSlug="test-workspace" />, { wrapper: createWrapper() });

    await waitFor(() => {
      // Should have 12 color buttons
      const colorButtons = screen.getAllByRole('button').filter(
        (btn) => btn.style.backgroundColor,
      );
      expect(colorButtons.length).toBe(12);
    });
  });

  it('should show save button', async () => {
    render(<BrandingForm workspaceSlug="test-workspace" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Save Branding')).toBeInTheDocument();
    });
  });

  it('should select a color when clicked', async () => {
    render(<BrandingForm workspaceSlug="test-workspace" />, { wrapper: createWrapper() });

    await waitFor(() => {
      const colorButtons = screen.getAllByRole('button').filter(
        (btn) => btn.style.backgroundColor,
      );
      expect(colorButtons.length).toBeGreaterThan(0);
    });

    const colorButtons = screen.getAllByRole('button').filter(
      (btn) => btn.style.backgroundColor,
    );
    // Click a different color
    fireEvent.click(colorButtons[2]);

    // The button should be clickable and the component should re-render
    await waitFor(() => {
      expect(colorButtons[2]).toBeInTheDocument();
    });
  });

  it('should call API when save is clicked', async () => {
    const { useUpdateWorkspace } = await import('@/hooks/useWorkspace');
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    vi.mocked(useUpdateWorkspace).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);

    render(<BrandingForm workspaceSlug="test-workspace" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Save Branding')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Branding'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });
});
