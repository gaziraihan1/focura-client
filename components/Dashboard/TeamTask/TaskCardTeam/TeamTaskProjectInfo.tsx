import { Folder } from 'lucide-react';

interface TeamTaskProjectInfoProps {
  workspaceName: string;
  projectName: string;
}

export function TeamTaskProjectInfo({
  workspaceName,
  projectName,
}: TeamTaskProjectInfoProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Folder size={14} className="text-muted-foreground" />
      <span className="text-xs text-muted-foreground">
        {workspaceName} • {projectName}
      </span>
    </div>
  );
}