export default function ReviewsLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <div className="border-b border-border/40 bg-gradient-to-b from-background via-background to-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 h-14 w-14 animate-pulse rounded-2xl bg-muted" />
            <div className="h-10 w-64 animate-pulse rounded-lg bg-muted sm:h-12 sm:w-80" />
            <div className="mt-4 h-5 w-96 animate-pulse rounded bg-muted max-w-2xl" />
            <div className="mt-8 h-12 w-60 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Stats */}
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        {/* Form placeholder */}
        <div className="mt-6 h-40 animate-pulse rounded-lg bg-muted" />
        {/* List items */}
        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
