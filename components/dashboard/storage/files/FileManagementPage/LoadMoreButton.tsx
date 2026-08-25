// components/FileManagement/LoadMoreButton.tsx
import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export function LoadMoreButton({
  hasMore,
  isLoading,
  onLoadMore,
}: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Load More Files
      </button>
    </div>
  );
}