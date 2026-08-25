import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  variant?: "text" | "circle" | "rect" | "card";
}

export function SkeletonLoader({
  className,
  count = 1,
  variant = "text",
}: SkeletonLoaderProps) {
  const baseClass = "animate-pulse rounded bg-muted";

  const variantClass = {
    text: "h-4 w-full",
    circle: "h-10 w-10 rounded-full",
    rect: "h-20 w-full rounded-lg",
    card: "h-32 w-full rounded-xl",
  }[variant];

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn(baseClass, variantClass)} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-8 w-1/4 animate-pulse rounded bg-muted" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
