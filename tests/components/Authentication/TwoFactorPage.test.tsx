import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  useSession: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  toast: Object.assign(
    (message: string) => {},
    { success: vi.fn(), error: vi.fn() },
  ),
  default: (message: string) => {},
}));

vi.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

import TwoFactorPage from '@/app/authentication/2fa/page';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

describe('TwoFactorPage', () => {
  const mockPush = vi.fn();
  const mockReplace = vi.fn();
  const mockGet = vi.fn();
  const mockUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush, replace: mockReplace });
    (useSearchParams as any).mockReturnValue({ get: mockGet });
    (useSession as any).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: mockUpdate,
    });
  });

  it('shows expired session fallback when no email is provided', () => {
    mockGet.mockReturnValue(null);

    render(<TwoFactorPage />);

    expect(screen.getByText('Missing email')).toBeInTheDocument();
    expect(screen.getByText('No email was provided. Please sign in again.')).toBeInTheDocument();
    expect(screen.getByText('Back to sign in')).toBeInTheDocument();
  });

  it('renders the 2FA verification form when email is provided', () => {
    mockGet.mockReturnValue('test@example.com');

    render(<TwoFactorPage />);

    expect(screen.getByText('Two-factor authentication')).toBeInTheDocument();
    expect(screen.getByText('Verify your')).toBeInTheDocument();
    expect(screen.getByText('identity')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Re-enter your password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
    expect(screen.getByText('Verify & sign in')).toBeInTheDocument();
  });

  it('calls signIn with credentials and totpCode on submit', async () => {
    mockGet.mockReturnValue('test@example.com');
    (signIn as any).mockResolvedValue({ ok: true });

    render(<TwoFactorPage />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Re-enter your password'), 'password123');
    await user.type(screen.getByPlaceholderText('000000'), '123456');
    await user.click(screen.getByText('Verify & sign in'));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
        totpCode: '123456',
      });
    });
  });

  it('shows error toast and does not redirect on failed verification', async () => {
    mockGet.mockReturnValue('test@example.com');
    (signIn as any).mockResolvedValue({ error: 'Invalid verification code. Please try again.' });

    render(<TwoFactorPage />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Re-enter your password'), 'password123');
    await user.type(screen.getByPlaceholderText('000000'), '000000');
    await user.click(screen.getByText('Verify & sign in'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid verification code. Please try again.',
      );
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects to success page on successful verification', async () => {
    mockGet.mockReturnValue('test@example.com');
    (signIn as any).mockResolvedValue({ ok: true });

    render(<TwoFactorPage />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Re-enter your password'), 'password123');
    await user.type(screen.getByPlaceholderText('000000'), '123456');
    await user.click(screen.getByText('Verify & sign in'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Verified successfully! Welcome back.');
      expect(mockPush).toHaveBeenCalledWith('/authentication/success');
    });
  });

  it('handles exception during verification', async () => {
    mockGet.mockReturnValue('test@example.com');
    (signIn as any).mockRejectedValue(new Error('Network error'));

    render(<TwoFactorPage />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Re-enter your password'), 'password123');
    await user.type(screen.getByPlaceholderText('000000'), '123456');
    await user.click(screen.getByText('Verify & sign in'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Something went wrong. Please try again.',
      );
    });
  });

  it('redirects to login when email is missing and form is submitted', async () => {
    mockGet.mockReturnValue('');

    render(<TwoFactorPage />);

    expect(screen.getByText('Missing email')).toBeInTheDocument();
  });
});
