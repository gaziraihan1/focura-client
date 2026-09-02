// components/FileManagement/LoadMoreButton.tsx
import { Button } from '@/components/ui/Button';

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
      <Button
        variant="outline"
        onClick={onLoadMore}
        loading={isLoading}
        className="px-6 py-3 rounded-lg border hover:bg-muted"
      >
        Load More Files
      </Button>
    </div>
  );
}