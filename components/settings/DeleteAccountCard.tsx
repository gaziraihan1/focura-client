'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { announce } from '@/lib/a11y';

interface GuardedWorkspace {
  id: string;
  name: string;
  slug: string;
}

interface DeleteAccountError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      data?: { workspaces?: GuardedWorkspace[] };
    };
  };
}

/**
 * Danger Zone card — self-service account deletion.
 *
 * Re-authentication: the account password is required when the account has
 * one (the backend skips the check for OAuth-only accounts). Guards: the
 * backend rejects (409) while the user is the sole owner of a workspace that
 * has other members; the card surfaces the workspace list so ownership can
 * be transferred first.
 */
export function DeleteAccountCard() {
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [blockedWorkspaces, setBlockedWorkspaces] = useState<GuardedWorkspace[]>([]);
  const [error, setError] = useState('');

  const canConfirm = confirmText.trim().toUpperCase() === 'DELETE';

  const reset = () => {
    setConfirming(false);
    setConfirmText('');
    setPassword('');
    setBlockedWorkspaces([]);
    setError('');
  };

  const handleDelete = async () => {
    if (!canConfirm) return;
    setDeleting(true);
    setError('');
    setBlockedWorkspaces([]);
    try {
      await api.delete('/api/v1/user/account', { data: { password } });
      toast.success('Account deleted. Sorry to see you go!');
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      setDeleting(false);
      const status = (err as DeleteAccountError)?.response?.status;
      const body = (err as DeleteAccountError)?.response?.data;
      if (status === 401) {
        setError('Incorrect password. Please try again.');
        announce('Incorrect password. Account deletion requires your password.');
      } else if (status === 409 && Array.isArray(body?.data?.workspaces)) {
        setBlockedWorkspaces(body.data.workspaces);
        setError(
          body.message ||
            'Transfer ownership of the workspaces below before deleting your account.'
        );
        announce('Account deletion blocked — transfer workspace ownership first.');
      } else {
        setError('Failed to delete your account. Please try again later.');
        toast.error('Failed to delete account');
        announce('Failed to delete account');
      }
    }
  };

  return (
    <div className="rounded-2xl border border-red-500/20 bg-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
          <AlertTriangle className="w-5 h-5 text-red-500" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-red-500">Danger Zone</h3>
          <p className="text-xs text-red-500/70 mt-0.5">
            Permanently delete your account and all associated data
          </p>
        </div>
      </div>

      {!confirming ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
          <div>
            <p className="font-medium text-foreground">Delete Account</p>
            <p className="text-sm text-muted-foreground">
              Irreversible — all personal data is purged within 30 days
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Delete Account
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm font-medium text-foreground">
              Are you absolutely sure?
            </p>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              This action is permanent and cannot be undone. You will be signed
              out of every device. To confirm, type <span className="font-mono font-semibold">DELETE</span> below.
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              aria-label="Type DELETE to confirm account deletion"
              className="mt-3 w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            />

            <div className="mt-3">
              <label
                htmlFor="delete-account-password"
                className="block text-xs font-medium text-muted-foreground mb-2"
              >
                Password
              </label>
              <input
                id="delete-account-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Required if your account has a password.
              </p>
            </div>

            {error && (
              <p role="alert" className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            {blockedWorkspaces.length > 0 && (
              <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Transfer ownership before deleting your account
                </p>
                <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-400/80">
                  You are the sole owner of the following workspaces. Transfer
                  ownership to another member (or remove the other members) and
                  try again.
                </p>
                <ul className="mt-3 space-y-2">
                  {blockedWorkspaces.map((ws) => (
                    <li key={ws.id}>
                      <Link
                        href={`/dashboard/workspaces/${ws.slug}/settings`}
                        className="text-sm font-medium text-amber-700 dark:text-amber-400 underline underline-offset-2 decoration-amber-500/40 transition-colors hover:decoration-amber-500"
                      >
                        {ws.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={!canConfirm || deleting}
                aria-busy={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                {deleting ? 'Deleting...' : 'Permanently delete my account'}
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={deleting}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
