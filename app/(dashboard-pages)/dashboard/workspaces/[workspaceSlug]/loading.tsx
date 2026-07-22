export default function WorkspaceLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
        <div className="space-y-2">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-56 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-7 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-2 w-1/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
