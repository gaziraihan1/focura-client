'use client';

import { MessageSquare, ExternalLink, Unlink2, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

interface SlackMessageLinkProps {
  taskId: string;
  channelId: string | null;
  messageTs: string | null;
  messageUrl: string | null;
  userDisplayName: string | null;
  onUnlinked?: () => void;
}

export function SlackMessageLink({
  taskId,
  channelId,
  messageTs,
  messageUrl,
  userDisplayName,
  onUnlinked,
}: SlackMessageLinkProps) {
  const [unlinking, setUnlinking] = useState(false);
  const unlinkingRef = useRef(false);

  if (!channelId || !messageTs) return null;

  const handleUnlink = async () => {
    if (unlinkingRef.current) return;
    unlinkingRef.current = true;
    setUnlinking(true);
    try {
      await api.put(`/api/v1/tasks/${taskId}/slack-unlink`);
      toast.success('Slack link removed');
      onUnlinked?.();
    } catch {
      toast.error('Failed to remove Slack link');
    } finally {
      unlinkingRef.current = false;
      setUnlinking(false);
    }
  };

  return (
    <div className="rounded-lg border border-[#4A154B]/20 dark:border-[#E01E5A]/20 bg-[#4A154B]/5 dark:bg-[#E01E5A]/5 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#4A154B] dark:text-[#E01E5A]" />
          <span className="text-xs font-semibold text-[#4A154B] dark:text-[#E01E5A]">
            Linked Slack Message
          </span>
        </div>
        <button
          onClick={handleUnlink}
          disabled={unlinking}
          className="p-1 rounded-md hover:bg-[#4A154B]/10 dark:hover:bg-[#E01E5A]/10 transition-colors disabled:opacity-50"
          title="Remove Slack link"
        >
          {unlinking ? (
            <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
          ) : (
            <Unlink2 className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">Channel:</span>
          <span>#{channelId}</span>
        </div>
        {userDisplayName && (
          <div className="flex items-center gap-1.5">
            <span className="font-medium">From:</span>
            <span>{userDisplayName}</span>
          </div>
        )}
        {messageUrl && (
          <a
            href={messageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
          >
            <ExternalLink className="w-3 h-3" />
            Open in Slack
          </a>
        )}
      </div>
    </div>
  );
}
