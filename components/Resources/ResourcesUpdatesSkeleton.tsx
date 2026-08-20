export default function ResourcesUpdatesSkeleton() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title skeleton */}
        <div className="text-center mb-16">
          <div className="h-9 w-72 mx-auto animate-pulse rounded bg-muted" />
          <div className="h-4 w-80 mx-auto mt-3 animate-pulse rounded bg-muted" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-border bg-background/40 space-y-3"
            >
              <div className="h-4 w-12 rounded animate-pulse bg-muted" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
