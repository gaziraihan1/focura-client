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


