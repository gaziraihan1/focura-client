'use client';

import { Shield, Monitor, Laptop, Smartphone, SmartphoneIcon, LogOut, Loader2 } from 'lucide-react';
import { useActiveSessions, useRevokeSession, useRevokeAllSessions } from '@/hooks/useSecurity';
import { Button } from '@/components/ui/Button';

function getDeviceIcon(device: string) {
  if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
    return SmartphoneIcon;
  }
  if (device.toLowerCase().includes('tablet') || device.toLowerCase().includes('ipad')) {
    return Smartphone;
  }
  return Laptop;
}

export function ActiveSessionsSection() {
  const { data: sessions = [], isLoading: sessionsLoading } = useActiveSessions();
  const revokeSession = useRevokeSession();
  const revokeAllSessions = useRevokeAllSessions();

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSession.mutateAsync(sessionId);
  };

  const handleRevokeAllSessions = async () => {
    if (confirm('This will log you out from all other devices. Continue?')) {
      await revokeAllSessions.mutateAsync();
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
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
          <Button
            variant="ghost"
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
          </Button>
        )}
      </div>

      {sessionsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" role="status" aria-label="Loading sessions" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8">
          <Monitor className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No active sessions found</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Active sessions">
          {sessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.device);
            return (
              <li
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
                      {session.os} &bull; {session.location || session.ip}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      Last active: {new Date(session.lastActiveAt).toLocaleDateString("en-US", { timeZone: "UTC" })}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="ghost"
                    onClick={() => handleRevokeSession(session.id)}
                    disabled={revokeSession.isPending}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    aria-label={`Revoke ${session.browser} session`}
                  >
                    {revokeSession.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
