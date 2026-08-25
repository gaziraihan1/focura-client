import { Github, MessageCircle } from 'lucide-react';

interface GitHubDiscussionLinkProps {
  discussionNumber: number;
  discussionUrl: string;
  discussionCategory?: string;
}

export function GitHubDiscussionLink({
  discussionNumber,
  discussionUrl,
  discussionCategory,
}: GitHubDiscussionLinkProps) {
  return (
    <div className="flex items-center gap-3">
      <Github size={16} className="text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">Discussion</p>
        <a
          href={discussionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline truncate"
        >
          <MessageCircle size={14} className="shrink-0" />
          <span>#{discussionNumber}</span>
          {discussionCategory && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border text-cyan-500 bg-cyan-500/10 border-cyan-500/20">
              {discussionCategory}
            </span>
          )}
        </a>
      </div>
    </div>
  );
}
