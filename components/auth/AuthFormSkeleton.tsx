export default function AuthFormSkeleton() {
  return (
    <div className="relative w-full max-w-md">
      {/* Decorative corner brackets */}
      <span className="pointer-events-none absolute -top-px -left-px h-8 w-8 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
      <span className="pointer-events-none absolute -top-px -right-px h-8 w-8 border-t-2 border-r-2 border-primary/30 rounded-tr-2xl" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-8 w-8 border-b-2 border-l-2 border-primary/30 rounded-bl-2xl" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-8 w-8 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />

      {/* Ambient glow blob */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-primary/5 scale-110" />

      <div className="w-full p-10 rounded-2xl bg-card border border-border/60 shadow-2xl shadow-black/40">
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-56 animate-pulse rounded bg-muted" />
        </div>

        {/* Form fields skeleton */}
        <div className="mt-8 space-y-4">
          <div className="space-y-3">
            {/* Name field (register only - show 2 fields for login, 3 for register) */}
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
          </div>

          {/* Submit button skeleton */}
          <div className="pt-2 space-y-3">
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
            
            {/* Divider skeleton */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-muted" />
              <div className="h-3 w-6 animate-pulse rounded bg-muted" />
              <div className="flex-1 h-px bg-muted" />
            </div>

            {/* Google button skeleton */}
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="mt-7 flex justify-center">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
