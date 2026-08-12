import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteAccountCard } from '@/components/Settings/DeleteAccountCard';
import { api } from '@/lib/axios';
import { signOut } from 'next-auth/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/axios', () => ({
  api: {
    delete: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/lib/a11y', () => ({
  announce: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const guardedError = {
  response: {
    status: 409,
    data: {
      success: false,
      message: 'Transfer ownership of the workspaces below before deleting your account.',
      data: {
        workspaces: [
          { id: 'ws-1', name: 'Acme Corp', slug: 'acme-corp' },
          { id: 'ws-2', name: 'Design Team', slug: 'design-team' },
        ],
      },
    },
  },
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DeleteAccountCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.delete).mockResolvedValue({ success: true });
  });

  it('renders the danger zone card', () => {
    render(<DeleteAccountCard />);
    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete Account' })).toBeInTheDocument();
  });

  it('opens the confirmation flow and requires typing DELETE', () => {
    render(<DeleteAccountCard />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));

    const input = screen.getByLabelText('Type DELETE to confirm account deletion');
    const confirm = screen.getByRole('button', { name: 'Permanently delete my account' });
    expect(confirm).toBeDisabled();

    fireEvent.change(input, { target: { value: 'delete' } });
    expect(confirm).toBeEnabled();
  });

  it('sends the password and signs out on success', async () => {
    const toast = (await import('react-hot-toast')).default;
    render(<DeleteAccountCard />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));

    fireEvent.change(screen.getByLabelText('Type DELETE to confirm account deletion'), {
      target: { value: 'DELETE' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Permanently delete my account' }));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/api/v1/user/account', {
        data: { password: 'secret123' },
      });
    });
    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });
    expect(toast.success).toHaveBeenCalledWith('Account deleted. Sorry to see you go!');
  });

  it('shows an incorrect-password error on 401 without signing out', async () => {
    vi.mocked(api.delete).mockRejectedValue({
      response: { status: 401, data: { message: 'Incorrect password.' } },
    });

    render(<DeleteAccountCard />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));
    fireEvent.change(screen.getByLabelText('Type DELETE to confirm account deletion'), {
      target: { value: 'DELETE' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Permanently delete my account' }));

    await waitFor(() => {
      expect(screen.getByText('Incorrect password. Please try again.')).toBeInTheDocument();
    });
    expect(signOut).not.toHaveBeenCalled();
  });

  it('surfaces the workspaces that block deletion on a 409', async () => {
    vi.mocked(api.delete).mockRejectedValue(guardedError);

    render(<DeleteAccountCard />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));
    fireEvent.change(screen.getByLabelText('Type DELETE to confirm account deletion'), {
      target: { value: 'DELETE' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Permanently delete my account' }));

    await waitFor(() => {
      expect(screen.getByText('Transfer ownership before deleting your account')).toBeInTheDocument();
    });
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Design Team')).toBeInTheDocument();
    // No sign-out on a blocked deletion.
    expect(signOut).not.toHaveBeenCalled();
    // The user can still retry.
    expect(screen.getByRole('button', { name: 'Permanently delete my account' })).toBeEnabled();
  });

  it('shows a generic error on unexpected failures', async () => {
    const toast = (await import('react-hot-toast')).default;
    vi.mocked(api.delete).mockRejectedValue(new Error('boom'));

    render(<DeleteAccountCard />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));
    fireEvent.change(screen.getByLabelText('Type DELETE to confirm account deletion'), {
      target: { value: 'DELETE' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Permanently delete my account' }));

    await waitFor(() => {
      expect(
        screen.getByText('Failed to delete your account. Please try again later.')
      ).toBeInTheDocument();
    });
    expect(toast.error).toHaveBeenCalledWith('Failed to delete account');
    expect(signOut).not.toHaveBeenCalled();
  });
});
