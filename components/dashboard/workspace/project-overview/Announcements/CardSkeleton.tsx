export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-2 w-14 bg-muted/60 rounded" />
        </div>
      </div>
      <div className="h-4 w-2/3 bg-muted rounded" />
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-muted/70 rounded" />
        <div className="h-3 w-5/6 bg-muted/60 rounded" />
        <div className="h-3 w-4/6 bg-muted/50 rounded" />
      </div>
    </div>
  );
}