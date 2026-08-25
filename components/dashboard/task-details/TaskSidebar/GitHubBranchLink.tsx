import { Github, GitBranch, Shield } from 'lucide-react';

interface GitHubBranchLinkProps {
  branchName: string;
  branchUrl: string;
  isProtected?: boolean;
}

export function GitHubBranchLink({
  branchName,
  branchUrl,
  isProtected = false,
}: GitHubBranchLinkProps) {
  return (
    <div className="flex items-center gap-3">
      <Github size={16} className="text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">Branch</p>
        <a
          href={branchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline truncate"
        >
          <GitBranch size={14} className="shrink-0" />
          <span className="truncate">{branchName}</span>
          {isProtected && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border text-amber-500 bg-amber-500/10 border-amber-500/20">
              <Shield size={10} />
              <span className="hidden sm:inline">Protected</span>
            </span>
          )}
        </a>
      </div>
    </div>
  );
}
