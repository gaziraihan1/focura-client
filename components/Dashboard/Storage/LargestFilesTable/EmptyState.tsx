import { File } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <File className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-sm text-muted-foreground">No files found</p>
    </div>
  );
}