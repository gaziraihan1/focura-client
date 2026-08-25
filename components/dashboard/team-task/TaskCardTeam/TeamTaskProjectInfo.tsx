import { Folder } from 'lucide-react';

interface TeamTaskProjectInfoProps {
  workspaceName: string;
  projectName: string;
}

export function TeamTaskProjectInfo({ workspaceName, projectName }: TeamTaskProjectInfoProps) {
  return (
    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-muted/60 border border-border/60">
      <Folder size={11} strokeWidth={2.2} className="text-muted-foreground" />
      <span className="text-xs text-muted-foreground">
        {workspaceName}
        <span className="mx-1 opacity-40">•</span>
        {projectName}
      </span>
    </div>
  );
}