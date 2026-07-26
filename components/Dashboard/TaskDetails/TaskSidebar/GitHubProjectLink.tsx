import { Github, Kanban } from 'lucide-react';

interface GitHubProjectLinkProps {
  projectNumber: number;
  projectUrl: string;
  projectTitle: string;
}

export function GitHubProjectLink({
  projectNumber,
  projectUrl,
  projectTitle,
}: GitHubProjectLinkProps) {
  return (
    <div className="flex items-center gap-3">
      <Github size={16} className="text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">Project</p>
        <a
          href={projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline truncate"
        >
          <Kanban size={14} className="shrink-0" />
          <span className="truncate">{projectTitle}</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border text-indigo-500 bg-indigo-500/10 border-indigo-500/20">
            #{projectNumber}
          </span>
        </a>
      </div>
    </div>
  );
}
