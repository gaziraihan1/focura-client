import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function LoadMoreButton({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: LoadMoreButtonProps) {
  if (!hasNextPage) return null;

  return (
    <button
      onClick={onLoadMore}
      disabled={isFetchingNextPage}
      className="w-full py-3 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
    >
      {isFetchingNextPage ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </>
      ) : (
        "Load More"
      )}
    </button>
  );
}