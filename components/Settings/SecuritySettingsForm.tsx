'use client';

import { useState } from 'react';
import { Lock, Shield, Save, Loader2, Eye, EyeOff, Smartphone, Monitor, Laptop, SmartphoneIcon, LogOut } from 'lucide-react';
import { 
  useChangePassword, 
  useActiveSessions, 
  useRevokeSession, 
  useRevokeAllSessions,
  validatePasswordStrength 
} from '@/hooks/useSecurity';

export function SecuritySettingsForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const changePassword = useChangePassword();
  const { data: sessions = [], isLoading: sessionsLoading } = useActiveSessions();
  const revokeSession = useRevokeSession();
  const revokeAllSessions = useRevokeAllSessions();

  const passwordStrength = validatePasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      return;
    }
    if (newPassword.length < 8) {
      return;
    }
    if (newPassword !== confirmPassword) {
      return;
    }

    await changePassword.mutateAsync(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
      }
    );
  };

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSession.mutateAsync(sessionId);
  };

  const handleRevokeAllSessions = async () => {
    if (confirm('This will log you out from all other devices. Continue?')) {
      await revokeAllSessions.mutateAsync();
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return SmartphoneIcon;
    }
    if (device.toLowerCase().includes('tablet') || device.toLowerCase().includes('ipad')) {
      return Smartphone;
    }
    return Laptop;
  };

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Change Password</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your account password
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-10 text-sm"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-10 text-sm"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1">
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
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm ${
                confirmPassword.length > 0 && !passwordsMatch
                  ? 'border-red-500'
                  : 'border-border'
              }`}
              placeholder="Confirm new password"
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
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

      {/* Two-Factor Authentication - Placeholder */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
            <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Two-Factor Authentication</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-border">
          <div>
            <p className="text-sm font-medium">Coming Soon</p>
            <p className="text-xs text-muted-foreground mt-1">
              Two-factor authentication will be available in a future update
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground">
            Soon
          </span>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Active Sessions</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Devices where you&apos;re currently logged in
              </p>
            </div>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeAllSessions}
              disabled={revokeAllSessions.isPending}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-500/10 transition-colors"
            >
              {revokeAllSessions.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <LogOut className="w-3 h-3" />
              )}
              Revoke All Others
            </button>
          )}
        </div>

        {sessionsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8">
            <Monitor className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No active sessions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const DeviceIcon = getDeviceIcon(session.device);
              return (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    session.isCurrent
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      session.isCurrent ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <DeviceIcon className={`w-4 h-4 ${session.isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{session.browser}</p>
                        {session.isCurrent && (
                          <span className="text-[10px] text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {session.os} • {session.location || session.ip}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60">
                        Last active: {new Date(session.lastActiveAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={revokeSession.isPending}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Revoke session"
                    >
                      {revokeSession.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
