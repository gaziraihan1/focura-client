export function ActivityErrorState() {
  return (
    <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-4 text-center">
      <p className="text-sm text-red-600 dark:text-red-400">
        Failed to load activities. Please try again.
      </p>
    </div>
  );
}