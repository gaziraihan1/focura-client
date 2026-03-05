export function QuotaSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4 animate-pulse">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="h-2.5 w-36 rounded bg-muted" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted shrink-0" />
        <div className="flex gap-2">
          {[72, 80, 76].map((w, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted" style={{ width: w }} />
          ))}
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted" />
    </div>
  );
}