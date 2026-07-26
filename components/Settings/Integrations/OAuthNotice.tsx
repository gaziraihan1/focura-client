import { AlertCircle } from 'lucide-react';

export function OAuthNotice() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">
            About OAuth Connections
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            When you connect a service, you&apos;ll be redirected to the
            provider&apos;s authorization page. Focura requests only the
            permissions needed for the integration features. You can revoke
            access at any time by disconnecting the integration.
          </p>
        </div>
      </div>
    </div>
  );
}
