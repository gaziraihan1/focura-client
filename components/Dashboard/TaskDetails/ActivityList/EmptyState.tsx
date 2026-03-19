// components/TaskActivity/EmptyState.tsx
import { Clock } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
        <Clock className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Activity will appear here as changes are made
      </p>
    </div>
  );
}