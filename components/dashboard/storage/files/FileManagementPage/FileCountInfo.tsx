// components/FileManagement/FileCountInfo.tsx
import { RefreshCw } from 'lucide-react';

interface FileCountInfoProps {
  filesCount: number;
  totalCount: number;
  isAdmin: boolean;
  onRefresh: () => void;
}

export function FileCountInfo({
  filesCount,
  totalCount,
  isAdmin,
  onRefresh,
}: FileCountInfoProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Showing {filesCount} of {totalCount} files
        </span>
        {isAdmin && (
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
            Admin View
          </span>
        )}
      </div>
      <button
        onClick={onRefresh}
        className="p-2 hover:bg-muted rounded transition-colors"
        title="Refresh"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
}