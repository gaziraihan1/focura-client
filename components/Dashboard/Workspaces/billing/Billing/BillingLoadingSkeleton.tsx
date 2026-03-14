export function PlanCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-10 bg-muted rounded w-1/2" />
        <div className="h-8 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}

export function InvoiceTableSkeleton() {
  return (
    <div className="px-6 py-10">
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-muted rounded" />
        ))}
      </div>
    </div>
  );
}