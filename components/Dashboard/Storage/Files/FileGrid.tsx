'use client';

import { Files } from 'lucide-react';
import { FileWithDetails } from '@/hooks/useFileManagement';
import { FileCard } from './FileCard';
import { FileList } from './FileList';

interface FileGridProps {
  files: FileWithDetails[];
  isAdmin: boolean;
  viewMode: 'grid' | 'list';
  workspaceId: string;
}

export function FileGrid({ files, isAdmin, viewMode, workspaceId }: FileGridProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <Files className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium mb-1">No files found</p>
        <p className="text-sm text-muted-foreground">
          {isAdmin
            ? 'No files have been uploaded to this workspace yet.'
            : "You haven't uploaded any files yet."}
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return <FileList files={files} isAdmin={isAdmin} workspaceId={workspaceId} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <FileCard key={file.id} file={file} isAdmin={isAdmin} workspaceId={workspaceId} />
      ))}
    </div>
  );
}