// src/components/labels/LabelManagementSkeleton.tsx

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={`bg-muted rounded animate-pulse ${className}`} />
  );
}

function LabelCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Header row: color dot + name + menu button */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <SkeletonBox className="w-3 h-3 rounded-full shrink-0" />
          <SkeletonBox className="h-4 w-28 rounded" />
        </div>
        <SkeletonBox className="w-7 h-7 rounded shrink-0" />
      </div>
      {/* Description lines */}
      <SkeletonBox className="h-3 w-full rounded mb-2" />
      <SkeletonBox className="h-3 w-3/4 rounded mb-3" />
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <SkeletonBox className="h-3 w-16 rounded" />
        <SkeletonBox className="h-3 w-12 rounded" />
      </div>
    </div>
  );
}

export function LabelGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <LabelCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function LabelManagementSkeleton() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Header skeleton ──────────────────────────────────────────────── */}
      <div className="border-b border-border px-2 sm:px-4 lg:px-0 py-4">
        <div className="flex items-center justify-between gap-3">

          {/* Left: back icon + title */}
          <div className="flex items-center gap-3 min-w-0">
            <SkeletonBox className="h-8 w-8 rounded shrink-0" />
            <SkeletonBox className="h-5 w-24 sm:w-32 rounded" />
          </div>

          {/* Right: search + button
              On mobile the search bar shrinks and the button collapses to icon-width */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search: full width on sm+, icon-sized slot on xs */}
            <SkeletonBox className="h-9 w-8 sm:w-48 md:w-56 rounded-md" />
            {/* Create button: icon-sized on xs, label-sized on sm+ */}
            <SkeletonBox className="h-9 w-9 sm:w-32 rounded-md shrink-0" />
          </div>

        </div>
      </div>

      {/* ── Grid skeleton ────────────────────────────────────────────────── */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LabelGridSkeleton />
      </main>

    </div>
  );
}