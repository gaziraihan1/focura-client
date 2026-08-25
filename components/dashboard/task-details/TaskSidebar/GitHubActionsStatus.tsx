import { Github, Workflow, CheckCircle2, XCircle, Clock, Ban } from 'lucide-react';

interface GitHubActionsStatusProps {
  workflowStatus: 'success' | 'failure' | 'pending' | 'cancelled';
  workflowName: string;
  workflowUrl: string;
  workflowRunId?: string;
}

const STATUS_CONFIG = {
  success: {
    label: 'Passed',
    icon: CheckCircle2,
    className: 'text-green-500 bg-green-500/10 border-green-500/20',
  },
  failure: {
    label: 'Failed',
    icon: XCircle,
    className: 'text-red-500 bg-red-500/10 border-red-500/20',
  },
  pending: {
    label: 'Running',
    icon: Clock,
    className: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  },
  cancelled: {
    label: 'Cancelled',
    icon: Ban,
    className: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
  },
} as const;

export function GitHubActionsStatus({
  workflowStatus,
  workflowName,
  workflowUrl,
}: GitHubActionsStatusProps) {
  const config = STATUS_CONFIG[workflowStatus];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <Github size={16} className="text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">CI/CD</p>
        <a
          href={workflowUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline truncate"
        >
          <Workflow size={14} className="shrink-0" />
          <span className="truncate">{workflowName}</span>
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${config.className}`}
          >
            <StatusIcon size={10} />
            <span className="hidden sm:inline">{config.label}</span>
          </span>
        </a>
      </div>
    </div>
  );
}
