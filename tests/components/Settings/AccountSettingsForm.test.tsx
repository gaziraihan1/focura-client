import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { AccountSettingsForm } from '@/components/Settings/AccountSettingsForm';
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

vi.mock('@/lib/a11y', () => ({
  announce: vi.fn(),
}));

vi.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: vi.fn(() => ({
    data: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Test bio',
      timezone: 'UTC',
      image: null,
    },
    isLoading: false,
  })),
  useInvalidateProfile: vi.fn(() => vi.fn()),
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

describe('AccountSettingsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.put).mockResolvedValue({ success: true });
  });

  it('should render form fields after loading', async () => {
    render(<AccountSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Profile Picture')).toBeInTheDocument();
    });

    expect(screen.getByText('Display Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Bio')).toBeInTheDocument();
    expect(screen.getByText('Timezone')).toBeInTheDocument();
  });

  it('should populate name field', async () => {
    render(<AccountSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });
  });

  it('should populate email field', async () => {
    render(<AccountSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    });
  });

  it('should populate bio field', async () => {
    render(<AccountSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
    });
  });

  it('should populate timezone field', async () => {
    render(<AccountSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByDisplayValue('UTC')).toBeInTheDocument();
    });
  });

  it('should show save button', async () => {
    render(<AccountSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });

  it('should have interactive name input', async () => {
    render(<AccountSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByLabelText('Display Name')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText('Display Name') as HTMLInputElement;
    expect(nameInput).not.toBeDisabled();
    expect(nameInput.type).toBe('text');
  });

  it('should call API when save is clicked', async () => {
    render(<AccountSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/api/v1/user/profile', expect.objectContaining({
        name: 'John Doe',
        bio: 'Test bio',
        timezone: 'UTC',
      }));
    });
  });

  it('should show success toast after save', async () => {
    const toast = (await import('react-hot-toast')).default;
    render(<AccountSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
    });
  });

  it('should disable save button while saving', async () => {
    vi.mocked(api.put).mockImplementation(() => new Promise(() => {}));

    render(<AccountSettingsForm />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });
});
