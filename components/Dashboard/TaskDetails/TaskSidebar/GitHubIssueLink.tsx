import { Github, CircleDot, CheckCircle2, XCircle } from 'lucide-react';

interface GitHubIssueLinkProps {
  issueUrl: string;
  issueNumber: number;
  issueState: 'open' | 'closed';
}

const STATE_CONFIG = {
  open: {
    label: 'Open',
    icon: CircleDot,
    className: 'text-green-500 bg-green-500/10 border-green-500/20',
  },
  closed: {
    label: 'Closed',
    icon: CheckCircle2,
    className: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
} as const;

export function GitHubIssueLink({
  issueUrl,
  issueNumber,
  issueState,
}: GitHubIssueLinkProps) {
  const config = STATE_CONFIG[issueState];
  const StateIcon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <Github size={16} className="text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">Issue</p>
        <a
          href={issueUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline truncate"
        >
          <CircleDot size={14} className="shrink-0" />
          <span>#{issueNumber}</span>
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${config.className}`}
          >
            <StateIcon size={10} />
            <span className="hidden sm:inline">{config.label}</span>
          </span>
        </a>
      </div>
    </div>
  );
}
