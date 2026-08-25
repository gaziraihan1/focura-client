import { Github, GitCommit, User } from 'lucide-react';

interface GitHubCommitLinkProps {
  commitSha: string;
  commitUrl: string;
  commitMessage?: string;
  commitAuthor?: string;
}

export function GitHubCommitLink({
  commitSha,
  commitUrl,
  commitMessage,
  commitAuthor,
}: GitHubCommitLinkProps) {
  const shortSha = commitSha.substring(0, 7);

  return (
    <div className="flex items-center gap-3">
      <Github size={16} className="text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">Latest Commit</p>
        <a
          href={commitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline truncate"
        >
          <GitCommit size={14} className="shrink-0" />
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
            {shortSha}
          </code>
        </a>
        {commitMessage && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {commitMessage}
          </p>
        )}
        {commitAuthor && (
          <div className="flex items-center gap-1 mt-0.5">
            <User size={10} className="text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              {commitAuthor}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
