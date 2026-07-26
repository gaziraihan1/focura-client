import { Github, Tag, Package } from 'lucide-react';

interface GitHubReleaseLinkProps {
  releaseName: string;
  releaseUrl: string;
  releaseTagName?: string;
}

export function GitHubReleaseLink({
  releaseName,
  releaseUrl,
  releaseTagName,
}: GitHubReleaseLinkProps) {
  return (
    <div className="flex items-center gap-3">
      <Github size={16} className="text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">Release</p>
        <a
          href={releaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline truncate"
        >
          <Package size={14} className="shrink-0" />
          <span className="truncate">{releaseName}</span>
          {releaseTagName && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border text-violet-500 bg-violet-500/10 border-violet-500/20">
              <Tag size={10} />
              <span className="hidden sm:inline">{releaseTagName}</span>
            </span>
          )}
        </a>
      </div>
    </div>
  );
}
