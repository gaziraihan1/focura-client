"use client";

interface SectionSkeletonProps {
  rows?: number;
  className?: string;
}

export function SectionSkeleton({ rows = 3, className = "" }: SectionSkeletonProps) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="h-4 w-32 bg-muted rounded" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 bg-muted rounded" />
              <div className="h-2 w-1/2 bg-muted rounded" />
            </div>
            <div className="h-6 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 w-32 bg-muted rounded mb-4" />
      <div className="h-48 w-full bg-muted rounded-xl" />
    </div>
  );
}

export function KPISkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-card border border-border rounded-xl p-3 sm:p-5">
          <div className="h-8 w-8 rounded-lg bg-muted mb-3" />
          <div className="h-2 w-20 bg-muted rounded mb-2" />
          <div className="h-6 w-16 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
