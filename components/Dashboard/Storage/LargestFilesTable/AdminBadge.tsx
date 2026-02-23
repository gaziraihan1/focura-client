import { Shield } from 'lucide-react';

export function AdminBadge() {
  return (
    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
      <Shield className="w-4 h-4 text-blue-500" />
      <p className="text-sm text-blue-600 dark:text-blue-500">
        <span className="font-medium">Admin Mode:</span> You can delete any file
        in this workspace
      </p>
    </div>
  );
}