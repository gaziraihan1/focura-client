import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function Pagination({
  pagination,
  currentPage,
  onPageChange,
}: {
  pagination: PaginationInfo;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  if (pagination.totalPages <= 1) return null;

  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
  // Show at most 5 page numbers around current
  const visible = pages.filter(
    (p) => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <p className="text-xs text-muted-foreground">
        {(currentPage - 1) * pagination.pageSize + 1}–
        {Math.min(currentPage * pagination.pageSize, pagination.totalCount)} of{" "}
        {pagination.totalCount}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrev}
          className="p-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>

        {visible.map((p, i) => {
          const prev = visible[i - 1];
          const showEllipsis = prev && p - prev > 1;
          return (
            <React.Fragment key={p}>
              {showEllipsis && (
                <span className="px-1 text-xs text-muted-foreground">…</span>
              )}
              <button
                onClick={() => onPageChange(p)}
                className={[
                  "w-7 h-7 rounded-lg text-xs font-semibold transition-colors",
                  p === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:bg-accent text-foreground",
                ].join(" ")}
              >
                {p}
              </button>
            </React.Fragment>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNext}
          className="p-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}