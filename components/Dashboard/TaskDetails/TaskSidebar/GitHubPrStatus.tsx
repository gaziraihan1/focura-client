import { Github, GitPullRequest, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { GitHubPrChecks } from '@/types/task.types';

interface GitHubPrStatusProps {
  prUrl: string;
  prNumber: number;
  prStatus: 'open' | 'merged' | 'closed';
  prChecks?: GitHubPrChecks | null;
}

const STATUS_CONFIG = {
  open: {
    label: 'Open',
    icon: AlertCircle,
    className: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  merged: {
    label: 'Merged',
    icon: CheckCircle2,
    className: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
  closed: {
    label: 'Closed',
    icon: XCircle,
    className: 'text-red-500 bg-red-500/10 border-red-500/20',
  },
} as const;

export function GitHubPrStatus({
  prUrl,
  prNumber,
  prStatus,
  prChecks,
}: GitHubPrStatusProps) {
  const config = STATUS_CONFIG[prStatus];
  const StatusIcon = config.icon;
  const allChecksPassing = prChecks && prChecks.totalChecks > 0 && prChecks.passingChecks === prChecks.totalChecks;

  return (
    <div className="flex items-center gap-3">
      <Github size={16} className="text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">Pull Request</p>
        <a
          href={prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline truncate"
        >
          <GitPullRequest size={14} className="shrink-0" />
          <span>#{prNumber}</span>
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${config.className}`}
          >
            <StatusIcon size={10} />
            <span className="hidden sm:inline">{config.label}</span>
          </span>
        </a>
        {prChecks && prChecks.totalChecks > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {allChecksPassing ? (
              <CheckCircle2 size={12} className="text-green-500" />
            ) : (
              <AlertCircle size={12} className="text-yellow-500" />
            )}
            <span className="text-xs text-muted-foreground">
              {prChecks.passingChecks}/{prChecks.totalChecks} checks passing
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
