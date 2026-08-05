'use client';

import { useState, useRef } from 'react';
import {
  X,
  MessageSquare,
  Link2,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useSlackIntegration } from '@/hooks/integration/useSlackIntegration';

interface SlackLinkModalProps {
  taskId: string;
  onClose: () => void;
  onLinked: () => void;
}

export function SlackLinkModal({ taskId, onClose, onLinked }: SlackLinkModalProps) {
  const [messageUrl, setMessageUrl] = useState('');
  const [linking, setLinking] = useState(false);
  const linkingRef = useRef(false);
  const { isConnected, loading: checkingSlack } = useSlackIntegration();

  const handleLink = async () => {
    const trimmed = messageUrl.trim();
    if (!trimmed) {
      toast.error('Please enter a Slack message URL');
      return;
    }

    // Basic validation: should be a Slack URL
    if (!trimmed.includes('slack.com')) {
      toast.error('Please enter a valid Slack message URL');
      return;
    }

    if (linkingRef.current) return;
    linkingRef.current = true;
    setLinking(true);
    try {
      // Parse channel and timestamp from Slack message URL
      // Format: https://<workspace>.slack.com/archives/<channel>/p<timestamp>
      const match = trimmed.match(/\/archives\/([A-Z0-9]+)\/p(\d+)/);
      if (!match) {
        toast.error(
          'Could not parse Slack URL. Use the "Copy link" from a Slack message.',
        );
        return;
      }

      const channelId = match[1];
      // Slack uses microsecond timestamps with 'p' prefix
      const messageTs = `${match[2].slice(0, 10)}.${match[2].slice(10)}`;

      await api.put(`/api/v1/tasks/${taskId}/slack-link`, {
        channelId,
        messageTs,
        messageUrl: trimmed,
      });

      toast.success('Slack message linked successfully');
      onLinked();
      onClose();
    } catch {
      toast.error('Failed to link Slack message');
    } finally {
      linkingRef.current = false;
      setLinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#4A154B] dark:text-[#E01E5A]" />
            <h3 className="text-lg font-semibold">Link Slack Message</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-accent transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Warning if Slack not connected */}
        {!checkingSlack && !isConnected && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                <p className="font-medium">Slack not connected</p>
                <p>
                  Connect Slack in Settings → Integrations to link messages.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-4 p-3 rounded-lg bg-muted/50 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            How to get a Slack message link:
          </p>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Open the message in Slack</li>
            <li>
              Click the <strong>three dots</strong> (More actions) on the
              message
            </li>
            <li>
              Select <strong>Copy link</strong>
            </li>
            <li>Paste the link below</li>
          </ol>
          <a
            href="https://slack.com/help/articles/201925137-Copy-links-to-messages"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Learn more
          </a>
        </div>

        {/* Input */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium">Slack Message URL</label>
          <input
            type="text"
            value={messageUrl}
            onChange={(e) => setMessageUrl(e.target.value)}
            placeholder="https://workspace.slack.com/archives/C123/p1234567890"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleLink()}
          />
          {messageUrl && messageUrl.includes('slack.com') && (
            <p className="text-xs text-green-600 dark:text-green-400">
              Workspace:{' '}
              {messageUrl.match(/https?:\/\/([^.]+)\.slack\.com/)?.[1] ||
                'Unknown'}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLink}
            disabled={linking || !messageUrl.trim() || (!checkingSlack && !isConnected)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50',
              isConnected
                ? 'bg-[#4A154B] dark:bg-[#E01E5A] text-white hover:bg-[#3d1140] dark:hover:bg-[#c01a4e]'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
          >
            {linking ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Link Message
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
