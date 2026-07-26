'use client';

import { useState, useEffect } from 'react';
import { X, Link2, GitPullRequest, CircleDot, GitBranch, GitCommit, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface GitHubLinkModalProps {
  taskId: string;
  onClose: () => void;
  onLinked: () => void;
}

type LinkType = 'pr' | 'issue' | 'branch' | 'commit';

interface LinkOption {
  type: LinkType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  description: string;
}

const LINK_OPTIONS: LinkOption[] = [
  {
    type: 'pr',
    label: 'Pull Request',
    icon: GitPullRequest,
    placeholder: '123 or https://github.com/owner/repo/pull/123',
    description: 'Link a GitHub PR to this task',
  },
  {
    type: 'issue',
    label: 'Issue',
    icon: CircleDot,
    placeholder: '456 or https://github.com/owner/repo/issues/456',
    description: 'Link a GitHub issue to this task',
  },
  {
    type: 'branch',
    label: 'Branch',
    icon: GitBranch,
    placeholder: 'feature/new-feature or https://github.com/owner/repo/tree/feature/new-feature',
    description: 'Link a GitHub branch to this task',
  },
  {
    type: 'commit',
    label: 'Commit',
    icon: GitCommit,
    placeholder: 'abc1234 or https://github.com/owner/repo/commit/abc1234',
    description: 'Link a GitHub commit to this task',
  },
];

function parseGitHubInput(input: string, type: LinkType): { url?: string; number?: number; sha?: string; name?: string } {
  const trimmed = input.trim();

  // Check if it's a URL
  if (trimmed.startsWith('http')) {
    if (type === 'pr') {
      const match = trimmed.match(/\/pull\/(\d+)/);
      return { url: trimmed, number: match ? parseInt(match[1]) : undefined };
    }
    if (type === 'issue') {
      const match = trimmed.match(/\/issues\/(\d+)/);
      return { url: trimmed, number: match ? parseInt(match[1]) : undefined };
    }
    if (type === 'branch') {
      const match = trimmed.match(/\/tree\/(.+)$/);
      return { url: trimmed, name: match ? decodeURIComponent(match[1]) : undefined };
    }
    if (type === 'commit') {
      const match = trimmed.match(/\/commit\/([a-f0-9]+)/);
      return { url: trimmed, sha: match ? match[1] : undefined };
    }
  }

  // It's a number or name
  if (type === 'pr' || type === 'issue') {
    const num = parseInt(trimmed);
    if (!isNaN(num)) {
      return { number: num };
    }
  }

  if (type === 'branch') {
    return { name: trimmed };
  }

  if (type === 'commit') {
    return { sha: trimmed };
  }

  return {};
}

export function GitHubLinkModal({ taskId, onClose, onLinked }: GitHubLinkModalProps) {
  const [selectedType, setSelectedType] = useState<LinkType>('pr');
  const [inputValue, setInputValue] = useState('');
  const [linking, setLinking] = useState(false);
  const [hasGitHub, setHasGitHub] = useState<boolean | null>(null);

  const selectedOption = LINK_OPTIONS.find((o) => o.type === selectedType)!;

  // Check if user has GitHub connected
  useEffect(() => {
    const checkGitHub = async () => {
      try {
        const result = await api.get('/api/v1/user/integrations', {
          showErrorToast: false,
        });
        const data = result?.data;
        if (Array.isArray(data)) {
          const githubConnected = data.some(
            (i: { provider: string; active: boolean }) => i.provider === 'github' && i.active,
          );
          setHasGitHub(githubConnected);
        } else {
          setHasGitHub(false);
        }
      } catch {
        setHasGitHub(false);
      }
    };
    checkGitHub();
  }, []);

  const handleLink = async () => {
    if (!inputValue.trim()) {
      toast.error('Please enter a value');
      return;
    }

    setLinking(true);
    try {
      const parsed = parseGitHubInput(inputValue, selectedType);

      await api.put(`/api/v1/tasks/${taskId}/github-link`, {
        type: selectedType,
        ...parsed,
      });

      toast.success(`GitHub ${selectedOption.label} linked successfully`);
      onLinked();
      onClose();
    } catch {
      toast.error(`Failed to link GitHub ${selectedOption.label.toLowerCase()}`);
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Link GitHub</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Warning if GitHub not connected */}
        {hasGitHub === false && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                <p className="font-medium">GitHub not connected</p>
                <p>Connect GitHub in Settings → Integrations for automatic status updates and webhook sync.</p>
              </div>
            </div>
          </div>
        )}

        {/* Link Type Selector */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {LINK_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                onClick={() => {
                  setSelectedType(option.type);
                  setInputValue('');
                }}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-colors',
                  selectedType === option.type
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-accent',
                )}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Input */}
        <div className="space-y-2 mb-6">
          <p className="text-xs text-muted-foreground">{selectedOption.description}</p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={selectedOption.placeholder}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleLink()}
          />
          {inputValue && inputValue.includes('github.com') && (
            <p className="text-xs text-green-600 dark:text-green-400">
              Repository: {inputValue.match(/github\.com\/([^/]+\/[^/]+)/)?.[1] || 'Unknown'}
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
            disabled={linking || !inputValue.trim()}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {linking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Link'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
