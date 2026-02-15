interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

function getPaginationRange(
  current: number,
  total: number
): (number | "ellipsis-start" | "ellipsis-end")[] {
  const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];
  const maxVisible = 7; // Maximum page buttons to show

  if (total <= maxVisible) {
    // Show all pages if total is less than max
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Always show first page
  pages.push(1);

  if (current <= 3) {
    // Near the start: 1 2 3 4 ... last
    for (let i = 2; i <= Math.min(4, total - 1); i++) {
      pages.push(i);
    }
    if (total > 4) {
      pages.push("ellipsis-end");
    }
  } else if (current >= total - 2) {
    // Near the end: 1 ... last-3 last-2 last-1 last
    pages.push("ellipsis-start");
    for (let i = Math.max(2, total - 3); i < total; i++) {
      pages.push(i);
    }
  } else {
    // In the middle: 1 ... current-1 current current+1 ... last
    pages.push("ellipsis-start");
    pages.push(current - 1);
    pages.push(current);
    pages.push(current + 1);
    pages.push("ellipsis-end");
  }

  // Always show last page (if not already shown)
  if (total > 1 && pages[pages.length - 1] !== total) {
    pages.push(total);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPaginationRange(currentPage, totalPages);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleEllipsisClick = (type: "start" | "end") => {
    if (type === "start") {
      // Jump backwards by 5 pages or to page 2
      const targetPage = Math.max(2, currentPage - 5);
      onPageChange(targetPage);
    } else {
      // Jump forwards by 5 pages or to second-to-last page
      const targetPage = Math.min(totalPages - 1, currentPage + 5);
      onPageChange(targetPage);
    }
  };

  return (
    <div className="space-y-4 pt-6">
      {/* Info */}
      {itemsPerPage && totalItems !== undefined && (
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Showing{" "}
          <span className="font-medium text-foreground">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-foreground">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {totalItems}
          </span>{" "}
          results
        </p>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={handlePrevious}
          className="px-3 py-1 rounded-md border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          Prev
        </button>

        {/* Page Numbers */}
        {pages.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <button
                key={`${page}-${index}`}
                onClick={() =>
                  handleEllipsisClick(
                    page === "ellipsis-start" ? "start" : "end"
                  )
                }
                className="px-2 py-1 text-muted-foreground hover:text-foreground transition cursor-pointer"
                aria-label={
                  page === "ellipsis-start"
                    ? "Jump to earlier pages"
                    : "Jump to later pages"
                }
                title={
                  page === "ellipsis-start"
                    ? "Click to go back 5 pages"
                    : "Click to go forward 5 pages"
                }
              >
                ...
              </button>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md border border-border transition ${
                page === currentPage
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted"
              }`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          disabled={currentPage === totalPages}
          onClick={handleNext}
          className="px-3 py-1 rounded-md border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}