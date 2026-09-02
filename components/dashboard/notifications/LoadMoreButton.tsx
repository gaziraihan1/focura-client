import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    <Button
      variant="outline"
      onClick={onLoadMore}
      disabled={isFetchingNextPage}
      className="w-full py-3 rounded-lg"
    >
      {isFetchingNextPage ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </>
      ) : (
        "Load More"
      )}
    </Button>
  );
}