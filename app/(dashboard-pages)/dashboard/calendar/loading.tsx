export default function CalendarLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="h-7 w-28 animate-pulse rounded-lg bg-muted" />
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="bg-card p-2 min-h-25">
            <div className="h-4 w-6 animate-pulse rounded bg-muted mb-2" />
            <div className="space-y-1">
              {i % 3 === 0 && <div className="h-5 w-full animate-pulse rounded bg-muted" />}
              {i % 5 === 0 && <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
