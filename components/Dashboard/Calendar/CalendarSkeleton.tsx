"use client";

export function CalendarSkeleton() {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading calendar">
      {/* Header Skeleton */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="h-8 w-48 bg-muted rounded-lg" />
              <div className="h-4 w-64 bg-muted rounded mt-2" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-24 bg-muted rounded-lg" />
              <div className="h-9 w-32 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/30">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="p-4 text-center">
                <div className="h-4 w-8 bg-muted rounded mx-auto" />
              </div>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="min-h-30 p-3 border-r border-b last:border-r-0 border-border"
              >
                <div className="h-5 w-5 bg-muted rounded mb-3" />
                <div className="space-y-2">
                  <div className="h-3 w-12 bg-muted rounded" />
                  <div className="h-1 w-full bg-muted rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <span className="sr-only">Loading calendar data...</span>
    </div>
  );
}
