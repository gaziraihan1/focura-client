'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/axios';

type CallbackStatus = 'loading' | 'success' | 'error';

export default function IntegrationsCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Handle OAuth errors from provider
      if (error) {
        setStatus('error');
        setMessage(errorDescription || `Authorization failed: ${error}`);
        return;
      }

      // Validate required parameters
      if (!code || !state) {
        setStatus('error');
        setMessage('Missing authorization code or state parameter');
        return;
      }

      try {
        // Send the authorization code to the backend for token exchange
        const result = await api.post<{ integration: { provider: string } }>(
          '/api/v1/user/integrations/callback',
          {
            code,
            state,
            provider: extractProviderFromState(state),
            redirectUri: `${window.location.origin}/integrations/callback`,
          },
        );

        if (result?.success) {
          setStatus('success');
          const provider = result.data?.integration?.provider || 'provider';
          setMessage(`Successfully connected ${provider}`);

          // Redirect to settings after 2 seconds
          setTimeout(() => {
            router.push('/dashboard/settings');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result?.message || 'Failed to complete integration');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.message || 'An error occurred while connecting');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center space-y-6">
        {/* Status Icon */}
        <div className="flex justify-center">
          {status === 'loading' && (
            <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          )}
          {status === 'error' && (
            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          )}
        </div>

        {/* Status Message */}
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">
            {status === 'loading' && 'Connecting...'}
            {status === 'success' && 'Connected!'}
            {status === 'error' && 'Connection Failed'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {status === 'loading' && 'Please wait while we complete the integration.'}
            {status === 'success' && message}
            {status === 'error' && message}
          </p>
        </div>

        {/* Actions */}
        {status !== 'loading' && (
          <div className="flex justify-center gap-3">
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {status === 'success' ? 'Go to Settings' : 'Back to Settings'}
            </button>
            {status === 'error' && (
              <button
                onClick={() => router.back()}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function extractProviderFromState(state: string): string | null {
  try {
    const decoded = JSON.parse(atob(state));
    return decoded.provider || null;
  } catch {
    return null;
  }
}
