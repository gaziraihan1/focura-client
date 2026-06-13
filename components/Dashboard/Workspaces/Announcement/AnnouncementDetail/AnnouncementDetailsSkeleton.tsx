/**
 * Skeleton matches AnnouncementDetail layout exactly.
 * Uses animate-pulse + bg-muted — no extra deps.
 */
export function AnnouncementDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl animate-pulse">
        {/* Back link */}
        <div className="mb-8 h-4 w-36 rounded-full bg-muted" />

        <div className="rounded-2xl border border-border bg-card shadow-(--shadow-card)">
          {/* Accent bar */}
          <div className="h-1 w-full rounded-t-2xl bg-muted" />

          <div className="p-6 sm:p-8 space-y-5">
            {/* Badges */}
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-5 w-20 rounded-full bg-muted" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="h-7 w-3/4 rounded-lg bg-muted" />
              <div className="h-7 w-1/2 rounded-lg bg-muted" />
            </div>

            {/* Author/meta row */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 rounded bg-muted" />
                  <div className="h-3 w-16 rounded bg-muted" />
                </div>
              </div>
              <div className="h-3.5 w-32 rounded bg-muted" />
            </div>

            {/* Divider */}
            <div className="h-px bg-muted" />

            {/* Body paragraphs */}
            <div className="space-y-3">
              {[100, 90, 75, 95, 60].map((w, i) => (
                <div
                  key={i}
                  className="h-4 rounded bg-muted"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}