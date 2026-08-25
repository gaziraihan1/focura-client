'use client';

import { useState } from 'react';
import { Download, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { announce } from '@/lib/a11y';
import { useUserProfile } from '@/hooks/useUserProfile';

type ExportState = 'idle' | 'loading' | 'requested' | 'error';

/**
 * Privacy & Data card — self-service data export.
 * Requests a JSON bundle of the user's data; the backend emails the file.
 */
export function DataExportCard() {
  const { data: profile } = useUserProfile();
  const [state, setState] = useState<ExportState>('idle');
  const [error, setError] = useState('');

  const handleExport = async () => {
    setState('loading');
    setError('');
    try {
      await api.post('/api/v1/user/export-data');
      setState('requested');
      toast.success('Export requested — check your email');
      announce('Export requested. A JSON file will be emailed to you shortly.');
    } catch {
      setState('error');
      setError('Failed to request your export. Please try again later.');
      toast.error('Failed to request data export');
      announce('Failed to request data export');
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
          <ShieldCheck className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Privacy &amp; Data</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Download everything we store about you
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Request a JSON export of your profile, workspaces, projects, tasks,
        comments, focus sessions, time entries, notifications, and activity.
        The file is emailed to your registered address within a few minutes.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={state === 'loading' || state === 'requested'}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
        >
          {state === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="w-4 h-4" aria-hidden="true" />
          )}
          {state === 'loading' ? 'Preparing export...' : 'Export my data'}
        </button>

        {state === 'requested' && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            Export requested — it will arrive at {profile?.email || 'your email'}
          </span>
        )}
        {state === 'error' && (
          <span role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
