/**
 * WorkspaceLayoutSkeleton
 *
 * Full-page loading skeleton shown while the workspace layout
 * data is being fetched.  Mirrors the three-panel layout:
 * sidebar (w-64) → header (h-14) → content area.
 */

export function WorkspaceLayoutSkeleton() {
  const bar = "animate-pulse bg-muted rounded-md";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Sidebar skeleton ─────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-card p-4 gap-4">
        {/* Workspace title area */}
        <div className="flex items-center gap-3">
          <div className={`${bar} h-8 w-8 rounded-lg`} />
          <div className={`${bar} h-4 w-32`} />
        </div>

        {/* Nav items */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`${bar} h-4 w-4`} />
            <div className={`${bar} h-3`} style={{ width: `${56 - i * 4}%` }} />
          </div>
        ))}
      </aside>

      {/* ── Main area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-x-clip">
        {/* Header skeleton */}
        <header className="h-14 shrink-0 border-b border-border bg-card flex items-center gap-3 px-4 sm:px-6">
          <div className={`${bar} h-5 w-5 lg:hidden`} />
          <div className={`${bar} h-4 w-40`} />
          <div className="flex-1" />
          <div className={`${bar} h-8 w-8 rounded-full`} />
          <div className={`${bar} h-8 w-8 rounded-full`} />
        </header>

        {/* Content skeleton */}
        <main className="flex-1 overflow-y-auto min-h-0 px-4 py-6 sm:px-6 lg:px-8 space-y-6">
          {/* Page title */}
          <div className="space-y-2">
            <div className={`${bar} h-7 w-56`} />
            <div className={`${bar} h-4 w-80`} />
          </div>

          {/* Cards / content blocks */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`${bar} h-32 rounded-xl border border-border`}
              />
            ))}
          </div>

          {/* Table / list skeleton */}
          <div className={`${bar} h-64 rounded-xl`} />
        </main>
      </div>
    </div>
  );
}
