import { RefreshCw, Trash2 } from "lucide-react";

interface ActivityPageHeaderProps {
  onRefresh: () => void;
  onClearAll: () => void;
}

export function ActivityPageHeader({
  onRefresh,
  onClearAll,
}: ActivityPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Activity Feed
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track all activities across your workspace
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>

        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-2 rounded-md border border-red-300 dark:border-red-900 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>
    </div>
  );
}