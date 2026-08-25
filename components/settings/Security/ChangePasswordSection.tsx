'use client';

import { useState } from 'react';
import { Lock, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import {
  useChangePassword,
  useSecuritySettings,
  validatePasswordStrength,
  formatLastPasswordChange,
} from '@/hooks/useSecurity';
import { announce } from '@/lib/a11y';

// Hoisted so the formatter is created once instead of on every render.
// timeZone is fixed to avoid hydration mismatches from server/local timezone drift.
const lastChangedFullFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const changePassword = useChangePassword();
  const { data: securitySettings, isError } = useSecuritySettings();

  const lastChangedLabel = formatLastPasswordChange(
    securitySettings?.lastPasswordChange,
  );
  const lastChangedFull = securitySettings?.lastPasswordChange
    ? lastChangedFullFormatter.format(new Date(securitySettings.lastPasswordChange))
    : null;

  const passwordStrength = validatePasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 8) return;
    if (newPassword !== confirmPassword) return;

    await changePassword.mutateAsync(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          announce('Password updated successfully');
        },
      }
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
          <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Change Password</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Update your account password
          </p>
          {(securitySettings !== undefined || isError) && (
            <p
              className="text-xs text-muted-foreground/70 mt-1"
              data-testid="last-password-change"
            >
              {lastChangedLabel ? (
                <time
                  dateTime={securitySettings?.lastPasswordChange ?? undefined}
                  title={lastChangedFull ?? undefined}
                >
                  Last changed {lastChangedLabel}
                  {lastChangedFull && (
                    <span className="sr-only"> on {lastChangedFull}</span>
                  )}
                </time>
              ) : (
                <span>No password change recorded</span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <div>
          <label htmlFor="current-password" className="block text-xs font-medium text-muted-foreground mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              id="current-password"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-10 text-sm"
              placeholder="Enter current password"
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="new-password" className="block text-xs font-medium text-muted-foreground mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-10 text-sm"
              placeholder="Enter new password"
              aria-required="true"
              aria-describedby="password-strength"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showNew ? 'Hide new password' : 'Show new password'}
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {newPassword.length > 0 && (
            <div className="mt-2 space-y-2" id="password-strength" aria-live="polite" aria-atomic="true">
              <div className="flex gap-1" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      level <= passwordStrength.score
                        ? passwordStrength.score <= 2
                          ? 'bg-red-500'
                          : passwordStrength.score <= 3
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {passwordStrength.score <= 2 && 'Weak password'}
                {passwordStrength.score === 3 && 'Fair password'}
                {passwordStrength.score === 4 && 'Good password'}
                {passwordStrength.score === 5 && 'Strong password'}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-xs font-medium text-muted-foreground mb-2">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm ${
              confirmPassword.length > 0 && !passwordsMatch
                ? 'border-red-500'
                : 'border-border'
            }`}
            placeholder="Confirm new password"
            aria-required="true"
            aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
            aria-describedby={confirmPassword.length > 0 && !passwordsMatch ? 'password-match-error' : undefined}
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p id="password-match-error" className="text-xs text-red-500 mt-1" role="alert">Passwords do not match</p>
          )}
        </div>

        <button
          onClick={handlePasswordChange}
          disabled={changePassword.isPending || !currentPassword || !newPassword || !confirmPassword || !passwordsMatch}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {changePassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {changePassword.isPending ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
}
